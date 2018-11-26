// +build unit
// +build !integration

package auth

import (
	// "github.com/fanky5g/xxxinafrica/web/server/database"
	// "github.com/stretchr/testify/assert"
	"fmt"
	"io/ioutil"
	"os"
	"testing"
)

func TestMain(m *testing.M) {
	tempdir, _ := ioutil.TempDir("", "testing")

	os.Setenv("AppURL", fmt.Sprintf("%s", APPRoot))
	os.Setenv("AppName", "Talents In Africa")
	os.Setenv("AppLogo", fmt.Sprintf("%s/images/logo.png", APPRoot))
	os.Setenv("AppIcon", fmt.Sprintf("%s/favicon.ico", APPRoot))
	os.Setenv("Secret", cfg.Secret)

	code := m.Run()
	// Server.Stop()
	os.RemoveAll(tempdir)

	os.Unsetenv("AppURL")
	os.Unsetenv("AppName")
	os.Unsetenv("AppLogo")
	os.Unsetenv("AppIcon")
	os.Unsetenv("Secret")

	os.Exit(code)
}

// func TestCheckDuplicateEmail(t *testing.T) {
// 	testuser.Avatar = avatar
// 	user, _ := NewUser(testuser, PASTOR)

// 	err := CheckDuplicateEmail(testuser.Email)
// 	assert.NoError(t, err)

// 	err = database.InsertItem("Users", "id", user)
// 	assert.NoError(t, err)

// 	err = CheckDuplicateEmail(user.Email)

// 	assert.Error(t, err)
// }

// func TestCheckDuplicateUsername(t *testing.T) {
// 	testuser.Avatar = avatar
// 	user, _ := NewUser(testuser, PASTOR)

// 	err := CheckDuplicateUsername(testuser.Username)
// 	assert.Error(t, err)

// 	err = database.DeleteItem("Users", "id", user.ID)
// 	assert.NoError(t, err)

// 	err = CheckDuplicateUsername(testuser.Username)
// 	assert.NoError(t, err)
// }
