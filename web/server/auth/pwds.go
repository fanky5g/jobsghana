package auth

import (
	"golang.org/x/crypto/bcrypt"
)

// EncryptPassword encrypts and mangles user password
func EncryptPassword(str string) (string, error) {
	hash := []byte(str)

	hashedPassword, err := bcrypt.GenerateFromPassword(hash, bcrypt.DefaultCost)
	return string(hashedPassword[:]), err
}

// VerifyPass verifies encrypted password against unencrypted string
func VerifyPass(hash string, against string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(against))

	if err == nil {
		return true, nil
	}
	return false, err
}
