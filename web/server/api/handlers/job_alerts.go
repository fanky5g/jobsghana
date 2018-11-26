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

// SaveJobAlert saves a jobalert subscription
func (h *Handlers) SaveJobAlert(c echo.Context) error {
	type jobAlertRequest struct {
		Email string `json:"email"`
	}

	var request jobAlertRequest
	err := c.Bind(&request)

	if err != nil {
		logger.Println(err)
		c.Error(errBadParameters)
		return errBadParameters
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var jobAlert types.JobAlert
	err = db.Where("email LIKE ?", request.Email).First(&jobAlert).Error
	if err != gorm.ErrRecordNotFound {
		if jobAlert.Email != "" {
			c.Response().Header().Set("Content-Type", "application/json")
			c.Response().WriteHeader(http.StatusOK)

			out := returnMsg{Success: true, Body: map[string]interface{}{
				"subscription_message": fmt.Sprintf("Your email %s is already subscribed to receive job alerts.", jobAlert.Email),
			}}

			return json.NewEncoder(c.Response()).Encode(out)
		}
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	err = db.Create(&types.JobAlert{Email: request.Email}).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := returnMsg{Success: true, Body: map[string]interface{}{
		"subscription_message": fmt.Sprintf("Your email %s has been subscribed to receive job postings based on your frequent searches.", request.Email),
	}}

	return json.NewEncoder(c.Response()).Encode(out)
}

// GetJobAlerts fetches individual's who have subscribed to receive job postings based on their search patterns
func (h *Handlers) GetJobAlerts(c echo.Context) error {
	var jobAlerts []types.JobAlert
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

	err := db.Model(&types.JobAlert{}).Limit(skip).Find(&jobAlerts).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	out := struct {
		Alerts []types.JobAlert `json:"job_alerts"`
		Skip   int              `json:"skip"`
	}{
		Alerts: jobAlerts,
		Skip:   len(jobAlerts) + skip,
	}

	return c.JSON(http.StatusOK, out)
}
