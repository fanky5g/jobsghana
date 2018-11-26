package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
)

// SendMessage receives contact messages from webpage
func (h *Handlers) SendMessage(c echo.Context) error {
	var message types.ContactMessage
	err := c.Bind(&message)
	if err != nil {
		// do not send error back to client
		errString := errors.New("Bad Request Sent")
		c.Error(errString)
		return errString
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	err = db.Create(&message).Error
	if err != nil {
		errString := errors.New("Failed to send message")
		c.Error(errString)
		return errString
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(returnMsg{Success: true, Message: "Mail successfully sent"})
}

// MarkMessageAsRead marks message as read by id
func (h *Handlers) MarkMessageAsRead(c echo.Context) error {
	type requestBody struct {
		ID string `json:"id"`
	}

	var input requestBody

	err := c.Bind(&input)
	if err != nil {
		errString := errors.New("Bad Request Sent")
		c.Error(errString)
		return errString
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var message types.ContactMessage

	id, _ := strconv.Atoi(input.ID)

	err = db.Model(&types.ContactMessage{}).Where("id = ?", uint(id)).First(&message).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		errString := errors.New("Message not found")
		c.Error(errString)
		return errString
	} else if err != nil {
		logger.Println(err)
		errString := errors.New("server error")
		c.Error(errString)
		return errString
	}

	err = db.Model(&message).Updates(map[string]interface{}{"read": true}).Error
	if err != nil {
		logger.Println(err)
		errString := errors.New("mark read failed")
		c.Error(errString)
		return errString
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(message)
}

// GetNewMessages gets all unread messages
func (h *Handlers) GetNewMessages(c echo.Context) error {
	var messages []types.ContactMessage

	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Where("read = ?", false).Find(&messages).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		logger.Println(err)
		errString := errors.New("server error")
		c.Error(errString)
		return errString
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(messages)
}
