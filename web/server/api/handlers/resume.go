package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/document"
	"github.com/fanky5g/xxxinafrica/web/server/queue"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"github.com/labstack/echo"
)

// ParseResume parses an attached resume and returns json containing resume and uploaded path
func (h *Handlers) ParseResume(c echo.Context) error {
	var savedFile types.FileMetadata

	upFiles := c.Get("files")
	if upFiles != nil {
		savedToS3 := upFiles.([]types.FileMetadata)
		savedFile = savedToS3[0]
	}

	resume, err := document.ParseResume(savedFile.Key)
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	// format resume
	resumeResponse := resume.Format()

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := returnMsg{Success: true, Body: types.ResumeParseResponse{
		resumeResponse,
		savedFile.Key,
	}}

	return json.NewEncoder(c.Response()).Encode(out)
}

// GetAccounts gets paginated accounts from dynamodb
func (h *Handlers) GetAccounts(c echo.Context) error {
	logAndReturnError := func(err error) error {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	var skip int
	if c.FormValue("skip") != "" {
		s, err := strconv.Atoi(c.FormValue("skip"))
		if err != nil {
			return logAndReturnError(fmt.Errorf("parameter skip returned error: %s", err.Error()))
		}
		skip = s
	}

	var accounts []types.User
	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Not("account_type", []string{"superadmin", "admin"}).Limit(50).Offset(skip).Order("created_at").Find(&accounts).Error
	if err != nil {
		logAndReturnError(err)
	}

	out := struct {
		Accounts []types.User `json:"accounts"`
		Skip     int          `json:"skip"`
	}{
		Accounts: accounts,
		Skip:     len(accounts) + skip,
	}

	return c.JSON(http.StatusOK, out)
}

// SaveResume saves a resume creation stage
func (h *Handlers) SaveResume(c echo.Context) error {
	stage := c.QueryParam("stage")
	numStages := c.QueryParam("numStages")

	// refactor this with editResume later
	type editRequest struct {
		Resume types.JobProfile `json:"resume"`
		ID     uint             `json:"id"`
	}

	logAndReturnError := func(err error) error {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	intStage, err := strconv.Atoi(stage)
	if err != nil {
		return logAndReturnError(err)
	}

	intNumStages, err := strconv.Atoi(numStages)
	if err != nil {
		return logAndReturnError(err)
	}

	var request editRequest
	err = c.Bind(&request)
	if err != nil {
		return logAndReturnError(err)
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User
	err = db.First(&user, request.ID).Error
	if err != nil && err.Error() != "record not found" {
		return logAndReturnError(err)
	}

	if err != nil && err.Error() == "record not found" {
		return logAndReturnError(fmt.Errorf("user not found"))
	}

	done := (intNumStages - 1) == intStage

	update := types.User{Profile: request.Resume}
	if !done {
		update.SignupStep = intStage + 1
	}

	if done {
		update.SignupStep = intNumStages
	}

	err = db.Model(&user).Updates(update).Error
	if err != nil {
		return logAndReturnError(err)
	}

	user.Profile = request.Resume
	i, err := auth.UpdateContext(c, user)
	if err != nil {
		return logAndReturnError(err)
	}

	c = i

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := make(map[string]interface{})

	if !done {
		out = map[string]interface{}{
			"success":    true,
			"next_stage": intStage + 1,
			"done":       false,
		}
	} else {
		out = map[string]interface{}{
			"success": true,
			"done":    true,
		}
	}

	return json.NewEncoder(c.Response()).Encode(out)
}

// GetResume gets a users resume
func (h *Handlers) GetResume(c echo.Context) error {
	logAndReturnError := func(err error) error {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	user, _ := auth.GetAuthenticatedUser(c)

	uid := c.QueryParam("uid")
	var uidUint64 uint64

	if uid != "" {
		i64, err := strconv.ParseUint(uid, 10, 8)
		if err != nil {
			logAndReturnError(err)
		}
		uidUint64 = i64
	} else if user != nil {
		uidUint64 = uint64(user.ID)
	} else {
		c.Error(fmt.Errorf("not enough details provided"))
	}

	if user == nil {
		user = &types.User{}
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var foundUser types.User
	err := db.First(&foundUser, uint(uidUint64)).Error
	if err != nil && err.Error() != "record not found" {
		return logAndReturnError(err)
	}

	if err != nil && err.Error() == "record not found" {
		return logAndReturnError(fmt.Errorf("resume not found"))
	}

	var resume types.JobProfile
	resume = foundUser.Profile

	var isAdmin bool

	if user.Role != nil {
		userType, _ := util.DecryptString(user.Role.Key, user.Role.Role)
		isAdmin = string(userType) == auth.ADMIN || string(userType) == auth.SUPERADMIN
	}

	if foundUser.ID != user.ID && !isAdmin {
		// make private sensitive fields
		resume.Basics.Email = "[restricted]"
		resume.Basics.Address = "[restricted]"
		resume.Basics.Name = "[restricted]"
		resume.Basics.Phone = "[restricted]"
	}

	// empty meta
	resume.Meta = types.Meta{}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(map[string]interface{}{
		"resume": resume,
	})
}

// AttachFiles attaches files to a user's profile
func (h *Handlers) AttachFiles(c echo.Context) error {
	var savedFile types.FileMetadata

	upFiles := c.Get("files")
	if upFiles != nil {
		savedToS3 := upFiles.([]types.FileMetadata)
		savedFile = savedToS3[0]
	}

	fileType := c.QueryParam("type")

	var cvFileKey string
	var coverLetterFileKey string

	if fileType == "cover_letter" {
		coverLetterFileKey = savedFile.Key
	} else if fileType == "resume" {
		cvFileKey = savedFile.Key
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(map[string]interface{}{
		"resume":       cvFileKey,
		"cover-letter": coverLetterFileKey,
	})
}

// EditResume edits a user's job profile
func (h *Handlers) EditResume(c echo.Context) error {
	type editRequest struct {
		Resume types.JobProfile `json:"resume"`
		ID     uint             `json:"id"`
	}

	logAndReturnError := func(err error) error {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	var request editRequest
	err := c.Bind(&request)
	if err != nil {
		return logAndReturnError(err)
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User
	err = db.First(&user, request.ID).Error
	if err != nil && err.Error() != "record not found" {
		return logAndReturnError(err)
	}

	if err != nil && err.Error() == "record not found" {
		return logAndReturnError(fmt.Errorf("user not found"))
	}

	update := types.User{Profile: request.Resume}
	err = db.Model(&user).Updates(update).Error
	if err != nil {
		return logAndReturnError(err)
	}

	user.Profile = request.Resume
	i, err := auth.UpdateContext(c, user)
	if err != nil {
		return logAndReturnError(err)
	}

	c = i

	// re-index user if approved
	if user.AccountApproved {
		work := func(data interface{}) error {
			user := data.(types.User)
			bleveIndex, err := database.GetBleveUserIndex()
			if err != nil {
				return err
			}

			err = user.Index(bleveIndex)
			if err != nil {
				return err
			}
			return nil
		}

		queue.WorkQueue <- types.WorkRequest{
			Work:    work,
			Payload: user,
		}

		return nil
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := returnMsg{Success: true, Message: "your resume was updated successfully"}
	return json.NewEncoder(c.Response()).Encode(out)
}

// ResumeViewed increases resume view count
func (h *Handlers) ResumeViewed(c echo.Context) error {
	type viewRequest struct {
		ID uint `json:"id"`
	}

	logAndReturnError := func(err error) error {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	var request viewRequest
	err := c.Bind(&request)
	if err != nil {
		return logAndReturnError(err)
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User
	err = db.First(&user, request.ID).Error
	if err != nil && err.Error() != "record not found" {
		return logAndReturnError(err)
	}

	if err != nil && err.Error() == "record not found" {
		return logAndReturnError(fmt.Errorf("user not found"))
	}

	update := types.User{Viewed: user.Viewed + 1}
	err = db.Model(&user).Updates(update).Error
	if err != nil {
		return logAndReturnError(err)
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := returnMsg{Success: true}
	return json.NewEncoder(c.Response()).Encode(out)
}
