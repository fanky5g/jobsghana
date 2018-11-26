package handlers

import (
	// "github.com/fanky5g/xxxinafrica/web/server/auth"
	// "github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	// "github.com/fanky5g/xxxinafrica/web/server/util"
	"bytes"
	"encoding/json"
	// "fmt"
	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	// "strings"
	"testing"
)

var (
// testuser = types.User{
// 	ID:        util.GenUniqueKey(),
// 	Email:     "fanky5g@gmail.com",
// 	Username:  "fanky5g",
// 	Firstname: "Benjamin",
// 	Lastname:  "Appiah-Brobbey",
// 	Password:  "delta5000",
// }
)

// +build unit
// +build !integration

type Response struct {
	message string `json:"message"`
	success string `json:"success"`
}

var (
	saveduser  *types.User
	savedToken string
	conf, _    = config.GetRawConfig()
	handlers   = &Handlers{
		Conf: conf,
	}
)

// func TestRegisterHandler(t *testing.T) {
// 	e := echo.New()

// 	w := &bytes.Buffer{}
// 	r := json.NewEncoder(w)

// 	err := r.Encode(testuser)

// 	if err != nil {
// 		t.Error(err)
// 	}

// 	req, err := http.NewRequest(echo.POST, fmt.Sprintf("/register?role=%s", auth.ADMIN), w)
// 	req.Header.Set("Content-Type", "application/json")

// 	res := httptest.NewRecorder()

// 	h := func(c echo.Context) error {
// 		return handlers.RegisterHandler(c)
// 	}

// 	c := e.NewContext(req, res)

// 	if assert.NoError(t, h(c)) {
// 		assert.Equal(t, http.StatusOK, res.Code)
// 		// test if user truly created
// 		items, err := database.GetItem("Users", "EmailIndex", "email", testuser.Email, auth.User{})
// 		assert.NoError(t, err)
// 		assert.NotEmpty(t, items)

// 		saveduser = items[0].(*auth.User)
// 		assert.NoError(t, err)
// 		assert.NotEmpty(t, saveduser)
// 	}
// }

// func TestEditHandler(t *testing.T) {
// 	e := echo.New()

// 	w := &bytes.Buffer{}
// 	r := json.NewEncoder(w)

// 	edituser := struct {
// 		User auth.User `json:"user"`
// 		Role string    `json:"role"`
// 	}{
// 		User: auth.User{
// 			ID:    testuser.ID,
// 			Email: testuser.Email,
// 		},
// 		Role: auth.DISTRICT,
// 	}

// 	err := r.Encode(edituser)
// 	assert.NoError(t, err)

// 	req, _ := http.NewRequest(echo.PUT, "/edit", w)
// 	req.Header.Set("Content-Type", "application/json")

// 	res := httptest.NewRecorder()

// 	h := func(c echo.Context) error {
// 		return handlers.EditHandler(c)
// 	}

// 	c := e.NewContext(req, res)

// 	assert.Error(t, h(c))
// 	assert.Equal(t, http.StatusInternalServerError, res.Code)

// 	anotherUpdate := struct {
// 		User auth.User `json:"user"`
// 		Role string    `json:"role"`
// 	}{
// 		User: auth.User{
// 			ID:        testuser.ID,
// 			Email:     testuser.Email,
// 			Firstname: "Aboagye",
// 		},
// 		Role: auth.ADMIN,
// 	}

// 	w.Reset()

// 	_ = r.Encode(anotherUpdate)
// 	req2, _ := http.NewRequest(echo.PUT, "/edit", w)
// 	rec := httptest.NewRecorder()

// 	req2.Header.Set("Content-Type", "application/json")

// 	c = e.NewContext(req2, rec)

// 	if assert.NoError(t, h(c)) {
// 		assert.Equal(t, http.StatusOK, rec.Code)
// 		var v returnMsg
// 		err = json.NewDecoder(rec.Result().Body).Decode(&v)
// 		assert.Equal(t, v.Success, true)
// 	}
// }

// func TestActivateUserHandler(t *testing.T) {
// 	e := echo.New()
// 	e.Debug = true

// 	req, _ := http.NewRequest(echo.GET, fmt.Sprintf("/user/activate?u=%s&code=%s", "miklin", saveduser.ActivationToken), nil)
// 	res := httptest.NewRecorder()

// 	h := func(c echo.Context) error {
// 		return handlers.ActivateUserHandler(c)
// 	}

// 	c := e.NewContext(req, res)

// 	if assert.Error(t, h(c)) {
// 		assert.Equal(t, res.Code, http.StatusInternalServerError)
// 		resp := res.Result()
// 		defer resp.Body.Close()

// 		var v returnMsg
// 		json.NewDecoder(resp.Body).Decode(&v)

// 		assert.Equal(t, v.Message, "user not found")
// 	}

// 	// redefine request and recorder
// 	req, _ = http.NewRequest(echo.GET, fmt.Sprintf("/user/activate?u=%s&code=%s", saveduser.Username, saveduser.ActivationToken), nil)
// 	res = httptest.NewRecorder()
// 	// redefine context
// 	c = e.NewContext(req, res)

// 	if assert.NoError(t, h(c)) {
// 		assert.Equal(t, res.Code, http.StatusFound)
// 		resp := res.Result()
// 		defer resp.Body.Close()

// 		assert.Equal(t, resp.Header.Get("Location"), fmt.Sprintf("%s/login?uactivate=1", APPRoot))
// 	}
// }

// func TestAuthenticationHandler(t *testing.T) {
// 	w := &bytes.Buffer{}
// 	loginDetails := struct {
// 		Handle   string `json:"handle"`
// 		Password string `json:"password"`
// 	}{saveduser.Username, testuser.Password}

// 	r := json.NewEncoder(w)
// 	r.Encode(loginDetails)

// 	e := echo.New()
// 	e.Debug = true

// 	req, _ := http.NewRequest(echo.POST, "/auth", w)
// 	req.Header.Set("Content-Type", "application/json")
// 	res := httptest.NewRecorder()

// 	h := func(c echo.Context) error {
// 		return handlers.AuthenticateUserHandler(c)
// 	}

// 	c := e.NewContext(req, res)

// 	if assert.NoError(t, h(c)) {
// 		assert.Equal(t, res.Code, http.StatusOK)
// 		resp := res.Result()
// 		authHeader := resp.Header.Get("Authorization")
// 		assert.NotEmpty(t, authHeader)
// 		assert.Contains(t, authHeader, "Bearer")
// 		savedToken = strings.Split(authHeader, " ")[1]
// 	}

// 	// test failed login
// 	loginDetails.Handle = "midrin"
// 	w.Reset()
// 	r.Encode(loginDetails)
// 	req, _ = http.NewRequest(echo.POST, "/auth", w)
// 	req.Header.Set("Content-Type", "application/json")
// 	res = httptest.NewRecorder()

// 	c = e.NewContext(req, res)
// 	if assert.Error(t, h(c)) {
// 		assert.Equal(t, res.Code, http.StatusInternalServerError)
// 		resp := res.Result()
// 		assert.Empty(t, resp.Header.Get("Authorization"))
// 		defer resp.Body.Close()
// 		var result returnMsg
// 		json.NewDecoder(resp.Body).Decode(&result)
// 		assert.Equal(t, result.Message, "user not found")
// 	}
// }

// func TestGetAuthenticatedUserHandler(t *testing.T) {
// 	e := echo.New()
// 	req, _ := http.NewRequest(echo.GET, "/", nil)
// 	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", savedToken))
// 	res := httptest.NewRecorder()
// 	c := e.NewContext(req, res)

// 	if assert.NoError(t, handlers.GetAuthenticatedUserHandler(c)) {
// 		assert.Equal(t, res.Code, http.StatusOK)
// 		resp := res.Result()
// 		defer resp.Body.Close()
// 		var b auth.User
// 		decoder := json.NewDecoder(resp.Body)
// 		decoder.Decode(&b)
// 		assert.NotEmpty(t, b)
// 		assert.NotEmpty(t, b.Firstname)
// 	}
// }

// func TestIsAuthorizedHandler(t *testing.T) {
// 	e := echo.New()

// 	// user is pastor from edit//test if he is allowed access
// 	adminOnly := struct {
// 		Roles []string `json:"roles"`
// 	}{[]string{auth.ADMIN}}
// 	w := &bytes.Buffer{}
// 	r := json.NewEncoder(w)
// 	r.Encode(adminOnly)

// 	req, _ := http.NewRequest(echo.POST, "/", w)
// 	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", savedToken))
// 	req.Header.Set("Content-Type", "application/json")
// 	res := httptest.NewRecorder()
// 	c := e.NewContext(req, res)

// 	if assert.NoError(t, handlers.IsAuthorizedHandler(c)) {
// 		assert.Equal(t, res.Code, http.StatusOK)
// 		resp := res.Result()
// 		defer resp.Body.Close()
// 		decoder := json.NewDecoder(resp.Body)
// 		var result struct {
// 			Authorized bool `json:"authorized"`
// 		}
// 		decoder.Decode(&result)
// 		assert.NotEmpty(t, result)
// 		assert.Equal(t, result.Authorized, true)
// 	}

// 	districtOnly := struct {
// 		Roles []string `json:"roles"`
// 	}{[]string{auth.DISTRICT}}
// 	w.Reset()
// 	r.Encode(districtOnly)
// 	req, _ = http.NewRequest(echo.POST, "/auth", w)
// 	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", savedToken))
// 	req.Header.Set("Content-Type", "application/json")
// 	res = httptest.NewRecorder()

// 	c = e.NewContext(req, res)

// 	if assert.NoError(t, handlers.IsAuthorizedHandler(c)) {
// 		assert.Equal(t, res.Code, http.StatusOK)
// 		resp := res.Result()
// 		defer resp.Body.Close()
// 		decoder := json.NewDecoder(resp.Body)
// 		var result struct {
// 			Authorized bool `json:"authorized"`
// 		}
// 		decoder.Decode(&result)
// 		assert.NotEmpty(t, result)
// 		assert.Equal(t, result.Authorized, false)
// 	}
// }

// func TestDeleteHandler(t *testing.T) {
// 	e := echo.New()
// 	e.Debug = true

// 	req, _ := http.NewRequest(echo.DELETE, fmt.Sprintf("/delete?id=%s", ""), nil)
// 	res := httptest.NewRecorder()

// 	h := func(c echo.Context) error {
// 		return handlers.DeleteHandler(c)
// 	}

// 	c := e.NewContext(req, res)

// 	if assert.Error(t, h(c)) {
// 		assert.Equal(t, res.Code, http.StatusInternalServerError)
// 		resp := res.Result()
// 		defer resp.Body.Close()

// 		var v returnMsg
// 		json.NewDecoder(resp.Body).Decode(&v)

// 		assert.Equal(t, v.Message, "delete handler not found")
// 	}

// 	// redefine request and recorder
// 	req, _ = http.NewRequest(echo.DELETE, fmt.Sprintf("/delete?id=%s", testuser.ID), nil)
// 	res = httptest.NewRecorder()
// 	// redefine context
// 	c = e.NewContext(req, res)

// 	if assert.NoError(t, h(c)) {
// 		assert.Equal(t, res.Code, http.StatusOK)
// 		var v returnMsg
// 		resp := res.Result()
// 		defer resp.Body.Close()
// 		json.NewDecoder(resp.Body).Decode(&v)
// 		assert.Equal(t, v.Success, true)
// 	}
// }

func TestApproveAccount(t *testing.T) {
	w := &bytes.Buffer{}
	accountDetails := struct {
		ID uint `json:"id"`
	}{5}

	r := json.NewEncoder(w)
	r.Encode(accountDetails)

	e := echo.New()
	e.Debug = true

	req, _ := http.NewRequest(echo.POST, "/approve", w)
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()

	h := func(c echo.Context) error {
		return handlers.ApproveAccount(c)
	}

	c := e.NewContext(req, res)

	if assert.NoError(t, h(c)) {
		assert.Equal(t, res.Code, http.StatusOK)
		var v returnMsg
		resp := res.Result()
		defer resp.Body.Close()
		json.NewDecoder(resp.Body).Decode(&v)
		assert.Equal(t, v.Success, true)
		assert.Equal(t, v.Message, "Account successfully approved")
	}
}
