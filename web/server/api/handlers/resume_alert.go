package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/labstack/echo"
)

// SaveResumeAlert saves alert for recruiters willing to be notified when a resume posted matches their descriptions
func (h *Handlers) SaveResumeAlert(c echo.Context) error {
	var resumeAlertRequest types.ResumeAlert
	err := c.Bind(&resumeAlertRequest)
	if err != nil {
		logger.Println(err)
		c.Error(errBadParameters)
		return errBadParameters
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	// just save, dont check for duplicates
	// validate later
	err = db.Create(&resumeAlertRequest).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	out := returnMsg{Success: true, Body: map[string]interface{}{
		"subscription_message": fmt.Sprintf("Resume Alert request submitted successfully for %s.", resumeAlertRequest.CompanyName),
	}}

	return json.NewEncoder(c.Response()).Encode(out)
}

// GetResumeAlerts fetches client's(companies) subscribed to receive resume alerts
func (h *Handlers) GetResumeAlerts(c echo.Context) error {
	var resumeAlerts []types.ResumeAlert
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

	err := db.Model(&types.ResumeAlert{}).Limit(skip).Find(&resumeAlerts).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	out := struct {
		Alerts []types.ResumeAlert `json:"resume_alerts"`
		Skip   int                 `json:"skip"`
	}{
		Alerts: resumeAlerts,
		Skip:   len(resumeAlerts) + skip,
	}

	return c.JSON(http.StatusOK, out)
}
