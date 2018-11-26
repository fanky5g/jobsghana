// +build unit
// +build !integration

package auth

import (
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

var (
	testuser = User{
		ID:       util.GenUniqueKey(),
		Email:    "fanky5g@gmail.com",
		Password: "delta5000",
	}
	genToken string
)

func TestGenerateJWTToken(t *testing.T) {
	expire := time.Now().Sub(time.Now().Add(-time.Second * 3600))
	token, err := testuser.GenerateJWTToken(fmt.Sprintf("%s", APPRoot), expire)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)
	genToken = token
}

func TestDecryptToken(t *testing.T) {
	claims, err := DecryptToken(genToken)
	assert.NoError(t, err)
	assert.NotNil(t, claims)
}

func TestVerificationToken(t *testing.T) {
	vToken, err := GenVerificationToken()
	assert.NoError(t, err)
	assert.NotEmpty(t, vToken)
	assert.Equal(t, len(vToken), 60)
}
