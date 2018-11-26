package auth

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"errors"
)

// CheckDuplicateEmail ensures we register users with unique email addresses
func CheckDuplicateEmail(email string) error {
	var user types.User
	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Where(&types.User{Email: email}).First(&user).Error
	if err != nil && err.Error() != "record not found" {
		return err
	}

	if err != nil && err.Error() == "record not found" {
		return nil
	}

	// user with email found
	return errors.New("Duplicate Email: " + email + " already registered")
}
