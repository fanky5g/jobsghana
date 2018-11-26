package handlers

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/email"
	"github.com/fanky5g/xxxinafrica/web/server/sessions"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"github.com/labstack/echo"
	gomail "gopkg.in/gomail.v2"
)

type returnMsg struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Body    interface{} `json:"body,omitempty"`
}

// RegisterHandler registers new users from bound api path
func (h *Handlers) RegisterHandler(c echo.Context) error {
	role := c.FormValue("role")
	templateDir := h.Conf.UString("TemplateDir")

	type inputUser struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	var userInput inputUser

	if role != string(auth.ADMIN) && role != string(auth.USER) {
		err := errors.New("unidentified user type")
		c.Error(err)
		return err
	}

	err := c.Bind(&userInput)
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	user := types.User{
		Email:    userInput.Email,
		Password: userInput.Password,
		Profile: types.JobProfile{
			Basics: types.Profile{
				Name:  userInput.Name,
				Email: userInput.Email,
			},
		},
	}

	// validate
	err = auth.CheckDuplicateEmail(user.Email)
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	u, err := auth.NewUser(user, role, []string{"Profile"})
	if err != nil {
		c.Error(err)
		logger.Println(err)
		return err
	}

	err = auth.Save(&u, fmt.Sprintf("%s/registration.tmpl", templateDir))
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	ret := returnMsg{Success: true}
	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(ret)
}

// EditHandler edits a specific user from bound api path
// @params: user => user object, role: (optional) - change user role
func (h *Handlers) EditHandler(c echo.Context) error {
	editObj := struct {
		User types.User `json:"user"`
		Role string     `json:"role"`
	}{}

	err := c.Bind(&editObj)
	if err != nil {
		c.Error(err)
		return err
	}

	if r := editObj.Role; r != "" {
		if r != auth.ADMIN {
			err = errors.New("specified role change not allowed")
			c.Error(err)
			return err
		}

		access, err := auth.GenUserAccess(r)
		if err != nil {
			c.Error(err)
			return err
		}
		editObj.User.Role = &access
	}

	err = auth.Edit(&editObj.User)

	if err != nil {
		c.Error(err)
		return err
	}

	ret := returnMsg{Success: true}
	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(ret)
}

// DeleteHandler deletes registered users
func (h *Handlers) DeleteHandler(c echo.Context) (err error) {
	if id := c.FormValue("id"); id == "" {
		err = errors.New("delete handler not found")
		c.Error(err)
		return err
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	err = db.Unscoped().Delete(&types.User{}, "id LIKE ?", c.FormValue("id")).Error

	if err != nil {
		c.Error(err)
		return err
	}

	ret := returnMsg{Success: true}
	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(ret)
}

// ActivateUserHandler activates user from activation code
func (h *Handlers) ActivateUserHandler(c echo.Context) error {
	umail := c.FormValue("e")
	code := c.FormValue("code")

	err := auth.ActivateUser(umail, code)
	if err != nil {
		c.Error(err)
		return err
	}

	ce, err := invalidateContext(c)
	if err != nil {
		logger.Println(err)
		// c.Error(errServer)
		// return err
	}

	c = ce

	return c.Redirect(http.StatusFound, fmt.Sprintf("%s/login?uactivated=_y", APPRoot))
}

// AuthenticateUserHandler authenticates a user and sets an authentication token on the response object for future authentications
func (h *Handlers) AuthenticateUserHandler(c echo.Context) error {
	var userDetails struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := c.Bind(&userDetails)
	if err != nil {
		c.Error(err)
		return err
	}

	token, userType, err := auth.Authenticate(userDetails.Email, userDetails.Password)
	if err != nil {
		c.Error(err)
		return err
	}

	if !util.IsEmpty(token) {
		c.Response().Header().Set("Authorization", fmt.Sprintf("Bearer %s", token))
		// save sessions and set cookie
		store, err := sessions.GetSessionStore()
		if err != nil {
			c.Error(err)
			return err
		}

		session, err := store.New(c.Request(), "token-store")
		if err != nil {
			c.Error(err)
			return err
		}

		session.Options.MaxAge = int(time.Now().Sub(time.Now().Add(-time.Hour * 24 * 2)).Nanoseconds()) //2 weeks validity
		session.Values["token"] = token

		if err = store.Save(c.Request(), c.Response().Writer, session); err != nil {
			c.Error(err)
			return err
		}
	}

	return c.JSON(http.StatusOK, returnMsg{Success: true, Body: map[string]string{"token": token, "type": userType}})
}

// LogoutUserHandler logs out a user
func (h *Handlers) LogoutUserHandler(c echo.Context) error {
	c, err := invalidateContext(c)
	if err != nil && err.Error() != "logout failure" {
		c.Error(err)
		return nil
	}

	return c.Redirect(http.StatusFound, "/")
}

func invalidateContext(c echo.Context) (echo.Context, error) {
	store, err := sessions.GetSessionStore()

	session, err := store.Get(c.Request(), "token-store")
	if err != nil {
		return c, err
	}

	session.Options.MaxAge = -1
	if err = session.Save(c.Request(), c.Response().Writer); err != nil {
		return c, fmt.Errorf("Logout failure")
	}
	return c, nil
}

// GetAuthenticatedUserHandler returns logged in user
func (h *Handlers) GetAuthenticatedUserHandler(c echo.Context) error {
	user, err := auth.GetAuthenticatedUser(c)

	if err != nil {
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(user)
}

// IsAuthorizedHandler authorizes logged in user against a set of roles
func (h *Handlers) IsAuthorizedHandler(c echo.Context) error {
	var roles struct {
		Roles []string `json:"roles"`
	}

	err := c.Bind(&roles)
	if err != nil {
		c.Error(err)
		return err
	}

	user, err := auth.GetAuthenticatedUser(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, returnMsg{Message: err.Error()})
	}

	var claims types.Claims
	claims.Account = *user

	isAuth := auth.Authorize(roles.Roles, &claims)
	result := struct {
		Authorized bool `json:"authorized"`
	}{isAuth}

	if !isAuth {
		return c.JSON(http.StatusUnauthorized, result)
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(result)
}

// ApproveAccount approves an account
func (h *Handlers) ApproveAccount(c echo.Context) error {
	type accountRequest struct {
		ID uint `json:"id"`
	}

	var request accountRequest

	logAndReturnError := func(err error) error {
		logger.Println(err)
		c.Error(err)
		return err
	}

	err := c.Bind(&request)
	if err != nil {
		return logAndReturnError(err)
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User
	err = db.First(&user, request.ID).Error

	if err != nil {
		if err.Error() == "record not found" {
			return logAndReturnError(fmt.Errorf("user not found"))
		}

		return logAndReturnError(err)
	}

	if user.AccountApproved {
		c.Response().Header().Set("Content-Type", "application/json")
		c.Response().WriteHeader(http.StatusOK)
		return json.NewEncoder(c.Response()).Encode(returnMsg{
			Success: true,
			Message: "Account already approved",
		})
	}

	// set user as approved
	err = db.Model(&user).Updates(types.User{AccountApproved: true}).Error
	if err != nil {
		logAndReturnError(err)
	}

	// bleve indexing
	bleveIndex, err := database.GetBleveUserIndex()
	if err != nil {
		return logAndReturnError(err)
	}

	err = user.Index(bleveIndex)
	if err != nil {
		return logAndReturnError(err)
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(returnMsg{
		Success: true,
		Message: "Account successfully approved",
	})
}

// SendTargetedMessage sends a targeted message to user
func (h *Handlers) SendTargetedMessage(c echo.Context) error {
	type inputData struct {
		Email   string `json:"email"`
		Name    string `json:"name"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}

	var dm inputData
	err := c.Bind(&dm)
	if err != nil {
		logger.Println(err)
		c.Error(errBadParameters)
		return errBadParameters
	}

	templateDir := h.Conf.UString("TemplateDir")

	data := struct {
		Name    string
		Message string
		Subject string
		To      string
	}{dm.Name, dm.Message, dm.Subject, dm.Email}

	targetedMail := &bytes.Buffer{}
	wr := bufio.NewWriter(targetedMail)

	err = email.GenTargetedEmail(wr, data, fmt.Sprintf("%s/targeted_message.tmpl", templateDir))
	if err != nil {
		return err
	}

	wr.Flush()

	mess := gomail.NewMessage()
	m := email.MailConfig{
		To:      []email.Receipient{{fmt.Sprintf("%s", data.Name), data.To}},
		From:    mess.FormatAddress("support@talentsinafrica.com", "Talents Community"),
		Subject: data.Subject,
	}

	mailer, err := email.GetMailer(m, email.SendSingle)
	if err != nil {
		return err
	}

	err = mailer.Send(targetedMail.Bytes())
	if err != nil {
		return err
	}

	return nil
}
