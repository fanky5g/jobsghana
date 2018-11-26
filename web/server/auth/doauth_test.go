// +build unit
// +build !integration

package auth

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/util"
	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

func TestStripJWTFromHeaders(t *testing.T) {
	e := echo.New()

	expire := time.Now().Sub(time.Now().Add(-time.Second * 3600))
	token, _ := testuser.GenerateJWTToken(fmt.Sprintf("%s", APPRoot), expire)

	req, _ := http.NewRequest(echo.POST, "/auth", nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	res := httptest.NewRecorder()

	c := e.NewContext(req, res)
	header := StripJWTFromHeaders(c)

	assert.NotEmpty(t, header)
}

func TestStripJWTFromHeadersNullToken(t *testing.T) {
	e := echo.New()

	req, _ := http.NewRequest(echo.POST, "/auth", nil)
	res := httptest.NewRecorder()

	c := e.NewContext(req, res)
	header := StripJWTFromHeaders(c)

	assert.Empty(t, header)
}

func TestAuthorize(t *testing.T) {
	expire := time.Now().Sub(time.Now().Add(-time.Second * 3600))
	key, _ := util.Gen32BitKey()

	r, _ := util.EncryptString(key, []byte(ADMIN))

	role := Access{
		Role: r,
		Key:  key,
	}

	testuser.Role = &role
	token, _ := testuser.GenerateJWTToken(fmt.Sprintf("%s", APPRoot), expire)

	claim, _ := DecryptToken(token)

	isauth := Authorize([]string{ADMIN}, claim)
	assert.Equal(t, isauth, true)

	isauth = Authorize([]string{PASTOR}, claim)
	assert.Equal(t, isauth, false)
}
