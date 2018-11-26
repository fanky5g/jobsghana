package handlers

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/document"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"github.com/labstack/echo"
)

var errCheckout = errors.New("checkout failure")

// InitiateResumeDownload initiates resume download process
func (h *Handlers) InitiateResumeDownload(c echo.Context) error {
	type resumeDownloadRequest struct {
		ID uint `json:"id"`
	}

	var request resumeDownloadRequest

	err := c.Bind(&request)
	if err != nil {
		c.Error(err)
		return err
	}

	// create new transaction
	resumeRequest := types.ResumeDownloadRequest{
		ExternalID: util.GenUniqueKey(),
		ResumeID:   request.ID,
		Paid:       false,
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	err = db.Create(&resumeRequest).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	payURL := fmt.Sprintf("%s/api/v1/resume/download/checkout?tid=%s", APPRoot, resumeRequest.ExternalID)

	// no error
	ret := returnMsg{Success: true, Body: struct {
		PayURL string `json:"checkout_url"`
	}{payURL}}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(ret)
}

// ProcessCheckout starts actual payment processing
func (h *Handlers) ProcessCheckout(c echo.Context) error {
	transID := c.QueryParam("tid")

	if transID == "" {
		c.Error(errors.New("missing id"))
		return errServer
	}

	// get resumeRequest
	db := database.GetMySQLInstance()
	defer db.Close()

	var request types.ResumeDownloadRequest
	err := db.Where(&types.ResumeDownloadRequest{ExternalID: transID}).First(&request).Error
	if err != nil && err.Error() != "record not found" {
		c.Error(err)
		return err
	}

	if err != nil && err.Error() == "record not found" {
		errString := errors.New("request invalid")
		c.Error(errString)
		return errString
	}

	body := &bytes.Buffer{}
	wr := multipart.NewWriter(body)
	cfg, _ := config.GetConfig()
	client := util.GetClient()

	fw, err := wr.CreateFormField("merchant_key")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(cfg.IPayMerchantKey))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	fw, err = wr.CreateFormField("total")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(fmt.Sprintf("%.6f", 5.00)))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	fw, err = wr.CreateFormField("invoice_id")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(request.ExternalID))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	fw, err = wr.CreateFormField("ipn_url")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(fmt.Sprintf("%s/api/v1/resume/callback", APPRoot)))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	fw, err = wr.CreateFormField("currency")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte("GHS"))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	// @todo: change webview close method
	fw, err = wr.CreateFormField("success_url")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(fmt.Sprintf("%s/api/v1/resume/callback?invoice_id=%s", APPRoot, transID)))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	fw, err = wr.CreateFormField("cancelled_url")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(fmt.Sprintf("%s/api/v1/resume/callback?invoice_id=%s", APPRoot, transID)))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	fw, err = wr.CreateFormField("deferred_url")
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	_, err = fw.Write([]byte(fmt.Sprintf("%s/api/v1/resume/callback?invoice_id=%s", APPRoot, transID)))
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	wr.Close()

	req, _ := http.NewRequest("POST", "https://community.ipaygh.com/gateway", body)
	req.Header.Set("Content-Type", wr.FormDataContentType())

	res, err := client.Do(req)
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	defer res.Body.Close()
	b, _ := ioutil.ReadAll(res.Body)

	if res.StatusCode != http.StatusOK {
		c.Error(errCheckout)
		logger.Println(string(b))
		return errCheckout
	}

	if res.StatusCode != http.StatusOK {
		c.Error(errors.New("payment initiation failed"))
		logger.Println(err)
		logger.Println(string(b))
		return err
	}

	return c.HTML(200, string(b))
}

// ResumeDownloadCallback checks if payment went through and starts resume download
func (h *Handlers) ResumeDownloadCallback(c echo.Context) error {
	invoiceID := c.QueryParam("invoice_id")
	if invoiceID == "" {
		c.Error(errCheckout)
		return errCheckout
	}

	// get transaction status from ipay
	client := util.GetClient()
	cfg, _ := config.GetConfig()

	request, _ := http.NewRequest("GET", fmt.Sprintf("https://community.ipaygh.com/v1/gateway/status_chk?invoice_id=%s&merchant_key=%s", invoiceID, cfg.IPayMerchantKey), nil)
	response, err := client.Do(request)
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	defer response.Body.Close()
	result, _ := ioutil.ReadAll(response.Body)
	resultString := string(result)

	resultArray := strings.Split(resultString, "~")
	status := resultArray[1]

	// get resume request
	var resumeDownloadRequest types.ResumeDownloadRequest
	db := database.GetMySQLInstance()
	defer db.Close()

	// db.Model(&types.ResumeDownloadRequest{}).Where
	err = db.Where(&types.ResumeDownloadRequest{ExternalID: invoiceID}).First(&resumeDownloadRequest).Error
	if err != nil && err.Error() != "record not found" {
		c.Error(err)
		return err
	}

	saveUpdate := func(update map[string]interface{}, requestID string) error {
		var downloadRequest types.ResumeDownloadRequest
		err := db.Where(&types.ResumeDownloadRequest{ExternalID: requestID}).First(&downloadRequest).Error
		if err != nil && err.Error() != "record not found" {
			return err
		}

		if err != nil && err.Error() == "record not found" {
			return errors.New("request not found")
		}

		return db.Model(&downloadRequest).Updates(update).Error
	}

	update := make(map[string]interface{})

	if status == "new" {
		errString := errors.New("Payment has not been processed for this request")
		c.Error(errString)
		return errString
	}

	if status == "cancelled" {
		// errString := errors.New("Payment was cancelled")
		// c.Error(errString)
		// return errString

		// process request
		update["paid"] = true
		err = saveUpdate(update, invoiceID)
		if err != nil {
			logger.Println(err)
			c.Error(err)
			return err
		}

		var downloads []downloadURL
		// grant user access to download...
		location, err := document.GenerateAccountResume(resumeDownloadRequest.ResumeID)
		if err != nil {
			c.Error(err)
			return err
		}

		downloads = append(downloads, downloadURL{
			LocalFile:   location,
			DeleteAfter: true,
			Name:        "resume.pdf",
		})

		return executeDownload(c, downloads, resumeDownloadRequest.ResumeID, h.S3Client)
	} else if status == "expired" {
		errString := errors.New("Payment for request expired")
		c.Error(errString)
		return errString
	} else if status == "paid" {
		// process request
		update["paid"] = true
		err = saveUpdate(update, invoiceID)
		if err != nil {
			logger.Println(err)
			c.Error(err)
			return err
		}

		var downloads []downloadURL
		// grant user access to download...
		location, err := document.GenerateAccountResume(resumeDownloadRequest.ResumeID)
		if err != nil {
			c.Error(err)
			return err
		}

		downloads = append(downloads, downloadURL{
			LocalFile:   location,
			DeleteAfter: true,
			Name:        "resume.pdf",
		})

		return executeDownload(c, downloads, resumeDownloadRequest.ResumeID, h.S3Client)
	}

	errString := errors.New("Request could not be completed")
	c.Error(errString)
	return errString
}

func executeDownload(c echo.Context, downloads []downloadURL, id uint, client *upload.S3Agent) error {
	var user types.User
	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.First(&user, id).Error
	if err != nil && err.Error() != "record not found" {
		c.Error(errServer)
		logger.Println(err)
		return errServer
	}

	go func(u types.User, update types.User) {
		db := database.GetMySQLInstance()
		defer db.Close()

		err := db.Model(&u).Updates(update).Error
		if err != nil {
			logger.Println(err)
		}
	}(user, types.User{
		Downloaded: user.Downloaded + 1,
	})

	if user.Profile.Meta.Public && user.Profile.Meta.AttachedCVFile != "" {
		downloads = append(downloads, downloadURL{
			Key:  user.Profile.Meta.AttachedCVFile,
			Name: fmt.Sprintf("original.%s", util.GetFileExt(user.Profile.Meta.AttachedCVFile)),
		})
	}

	if user.Profile.Meta.Public && user.Profile.Meta.AttachedCoverLetter != "" {
		downloads = append(downloads, downloadURL{
			Key:  user.Profile.Meta.AttachedCoverLetter,
			Name: fmt.Sprintf("original.%s", util.GetFileExt(user.Profile.Meta.AttachedCoverLetter)),
		})
	}

	if len(downloads) == 1 {
		if downloads[0].Key != "" {
			url, err := client.GetSignedURL(client.BucketName, downloads[0].Key)
			if err != nil {
				c.Error(err)
				return err
			}

			c.Redirect(302, *url)
			return nil
		}
	}

	// downloads are more than one, zip stream from s3 and pipe to response
	c.Response().Header().Set(echo.HeaderContentDisposition, fmt.Sprintf("attachment; filename=%s", "download.zip"))
	c.Response().Header().Set(echo.HeaderContentType, "application/zip")

	writer := zip.NewWriter(c.Response())

	for _, file := range downloads {
		var r io.ReadCloser
		if file.Key != "" {
			read, _, err := client.GetFile(client.BucketName, file.Key)

			if err != nil {
				c.Error(err)
				return err
			}

			r = read
		}

		if file.LocalFile != "" {
			file.LocalFile = strings.TrimPrefix(file.LocalFile, "/tmp/")
			f, err := os.Open(fmt.Sprintf("/tmp/%s", file.LocalFile))

			if err != nil {
				return err
			}

			r = f
		}

		defer r.Close()

		var name string
		if file.Name != "" {
			name = file.Name
		} else if file.Key != "" {
			name = file.Key
		}

		// rename this later
		h := &zip.FileHeader{Name: name, Method: zip.Deflate, Flags: 0x800}
		f, _ := writer.CreateHeader(h)

		_, err = io.Copy(f, r)
		if err != nil {
			c.Error(err)
			return err
		}

		if file.LocalFile != "" && file.DeleteAfter {
			err = os.Remove(fmt.Sprintf("/tmp/%s", file.LocalFile))
			if err != nil {
				return err
			}
		}
	}

	writer.Close()

	c.Response().Flush()
	time.Sleep(1 * time.Second)

	return nil
}
