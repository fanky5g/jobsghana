package handlers

import (
	"archive/zip"
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"fmt"
	"github.com/labstack/echo"
	"io"
	"os"
	"time"
)

// todo: downloads will be rather requested by a get request and hence we need to shorten file urls and
type downloadURL struct {
	Key         string `json:"key"`
	Name        string `json:"name"`
	LocalFile   string `json:"local"` //must be in /tmp
	DeleteAfter bool   `json:"delete"`
}

// DownloadHandler download files from aws bucket
func (h *Handlers) DownloadHandler(client *upload.S3Agent) echo.HandlerFunc {
	var downloads []downloadURL

	return func(c echo.Context) error {
		err := c.Bind(&downloads)
		if err != nil {
			c.Error(err)
			return err
		}

		// download only one file => consider renaming the file to its original name by streaming file to user
		// contentDisposition = "inline; filename=""#filename#""; filename*=UTF-8''#urlEncodedFormat( filename )#";
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
}
