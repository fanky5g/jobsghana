// +build unit
// +build !integration

package auth

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"fmt"
	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

var (
	u           *User
	savedToken  string
	avatar      = "http://file.jpg"
	templateURL = "../data/templates/registration.tmpl"
)

func TestEnsureFields(t *testing.T) {
	testuser.Avatar = avatar
	assert.Empty(t, testuser.ensureFields())
}

func TestGenUserAccess(t *testing.T) {
	a, err := GenUserAccess(ADMIN)
	assert.NoError(t, err)
	assert.IsType(t, new(Access), &a)
}

func TestNewUser(t *testing.T) {
	testuser.Avatar = avatar
	user, err := NewUser(testuser, ADMIN)
	assert.NoError(t, err)
	assert.NotEmpty(t, user)
	assert.NotEmpty(t, user.Role.Key)
	assert.NotEmpty(t, user.Role.Role)
	u = &user
}

func TestSaveUser(t *testing.T) {
	err := u.Save(templateURL)
	assert.NoError(t, err)
}

func TestEditUser(t *testing.T) {
	edituser := User{
		Firstname: "Boat",
		Email:     u.Email,
	}

	err := edituser.Edit(testuser.ID)
	assert.NoError(t, err)

	items, err := database.GetItem("Users", "EmailIndex", "email", u.Email, User{})
	assert.NoError(t, err)
	assert.NotEmpty(t, items)

	var editedUser *User
	editedUser = items[0].(*User)
	assert.Equal(t, "Boat", editedUser.Firstname)
}

func TestActivateUser(t *testing.T) {
	err := ActivateUser(u.Username, u.ActivationToken)
	assert.NoError(t, err)

	err = ActivateUser("midlin", u.ActivationToken)
	assert.Equal(t, err.Error(), "user not found")
}

func TestAuthenticate(t *testing.T) {
	// login with actual credentials
	// email login
	token, err := Authenticate(u.Email, testuser.Password)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	savedToken = token

	// username login
	token, err = Authenticate(u.Email, testuser.Password)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// invalid login
	token, err = Authenticate("dildrin", testuser.Password)
	assert.Error(t, err)
	assert.Empty(t, token)
	assert.Equal(t, err.Error(), "user not found")
}

func TestGetAuthenticatedUser(t *testing.T) {
	e := echo.New()
	req, _ := http.NewRequest(echo.POST, "/", nil)

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", savedToken))
	res := httptest.NewRecorder()

	c := e.NewContext(req, res)

	user, err := GetAuthenticatedUser(c)
	assert.NoError(t, err)
	assert.NotEmpty(t, user)
	assert.IsType(t, user, new(User))
}

func TestDeleteUser(t *testing.T) {
	err := u.Delete()
	assert.NoError(t, err)
}
