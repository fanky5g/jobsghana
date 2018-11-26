package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
)

// SubscribeToMailList subscribes user to mailing list
func (h *Handlers) SubscribeToMailList(c echo.Context) error {
	var subscriber types.MailListSubscriber
	err := c.Bind(&subscriber)
	if err != nil {
		c.Error(errBadParameters)
		return errBadParameters
	}

	if subscriber.Email == "" {
		errString := errors.New("missing email")
		c.Error(errString)
		return errString
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var foundSubscriber types.MailListSubscriber
	err = db.Where("email LIKE ?", subscriber.Email).First(&foundSubscriber).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		c.Error(errServer)
		logger.Println(err)
		return errServer
	}

	if foundSubscriber.Email == subscriber.Email { //double check if record was found
		// return already exists error
		c.Response().Header().Set("Content-Type", "application/json")
		c.Response().WriteHeader(http.StatusOK)
		out := map[string]interface{}{
			"exists":  true,
			"message": "subscription_exists",
		}
		return json.NewEncoder(c.Response()).Encode(out)
	}

	err = db.Create(&subscriber).Error
	if err != nil {
		c.Error(errServer)
		logger.Println(err)
		return errServer
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(subscriber)
}

// GetMaillistSubscribers gets list of subscribers to maillist
func (h *Handlers) GetMaillistSubscribers(c echo.Context) error {
	// newsletter_subscribers
	var subscribers []types.MailListSubscriber
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

	err := db.Model(&types.MailListSubscriber{}).Limit(50).Offset(skip).Order("created_at").Find(&subscribers).Error
	if err != nil {
		logger.Println(err)
		c.Error(errServer)
		return errServer
	}

	out := struct {
		Subscribers []types.MailListSubscriber `json:"newsletter_subscribers"`
		Skip        int                        `json:"skip"`
	}{
		Subscribers: subscribers,
		Skip:        len(subscribers) + skip,
	}

	return c.JSON(http.StatusOK, out)
}
