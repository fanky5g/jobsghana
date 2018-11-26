// +build unit
// +build !integration

package auth

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

var (
	encrypted string
	pass      = "gold59"
)

func TestEncryptPassword(t *testing.T) {
	data, err := EncryptPassword(pass)
	assert.NoError(t, err)
	assert.NotEmpty(t, data)
	encrypted = data
}

func TestVerifyPassword(t *testing.T) {
	match, err := VerifyPass(encrypted, pass)
	assert.NoError(t, err)
	assert.Equal(t, match, true)

	match, _ = VerifyPass(encrypted, "falsy")
	assert.Equal(t, match, false)
}
