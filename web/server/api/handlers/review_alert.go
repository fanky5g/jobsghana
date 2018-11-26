package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
)

// SaveReviewAlert saves a reviewalert subscription
func (h *Handlers) SaveReviewAlert(c echo.Context) error {
	type reviewAlertRequest struct {
		Email string `json:"email"`
	}

	var request reviewAlertRequest
	err := c.Bind(&request)

	if err != nil {
		logger.Println(err)
		c.Error(errBadParameters)
		return errBadParameters
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User
	err = db.Where("email LIKE ?", request.Email).First(&user).Error
	if err == gorm.ErrRecordNotFound {
		errString := fmt.Errorf("Resume does not exist for %s. Upload your Resume before continuing with request", request.Email)
		c.Error(errString)
		return errString
	}

	var reviewAlert types.ReviewAlert
	err = db.Where("email LIKE ?", request.Email).First(&reviewAlert).Error
	if err != gorm.ErrRecordNotFound {
		if reviewAlert.Email != "" {
			c.Response().Header().Set("Content-Type", "application/json")
			c.Response().WriteHeader(http.StatusOK)

			out := returnMsg{Success: true, Body: map[string]interface{}{
				"subscription_message": fmt.Sprintf("Your email %s is already subscribed to review alerts.", reviewAlert.Email),
			}}

			return json.NewEncoder(c.Response()).Encode(out)
		}

		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	err = db.Create(&types.ReviewAlert{Email: request.Email}).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := returnMsg{Success: true, Body: map[string]interface{}{
		"subscription_message": fmt.Sprintf("Your email %s has been subscribed to receive updates on resume downloads", request.Email),
	}}

	return json.NewEncoder(c.Response()).Encode(out)
}

// GetReviewAlerts fetches individual's who have subscribed to receive alerts when their resumes are downloaded
func (h *Handlers) GetReviewAlerts(c echo.Context) error {
	var reviewAlerts []types.ReviewAlert
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

	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Model(&types.ReviewAlert{}).Limit(skip).Find(&reviewAlerts).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	out := struct {
		Alerts []types.ReviewAlert `json:"review_alerts"`
		Skip   int                 `json:"skip"`
	}{
		Alerts: reviewAlerts,
		Skip:   len(reviewAlerts) + skip,
	}

	return c.JSON(http.StatusOK, out)
}
