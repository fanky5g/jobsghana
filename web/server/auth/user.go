package auth

import (
	"bufio"
	"bytes"
	"fmt"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/email"
	"github.com/fanky5g/xxxinafrica/web/server/queue"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	gomail "gopkg.in/gomail.v2"
)

// NewUser serializes user password and attaches serialized roles
func NewUser(rawuser types.User, role string, skip []string) (user types.User, err error) {
	err = rawuser.EnsureFields(skip)
	if err != nil {
		return
	}

	access, err := GenUserAccess(role)
	if err != nil {
		return
	}

	user.Role = &access
	p, err := EncryptPassword(rawuser.Password)
	if err != nil {
		return
	}

	user.UserID = util.GenUniqueKey()
	user.Password = p
	user.AccountType = role
	user.Email = rawuser.Email
	user.Profile = rawuser.Profile
	user.ProfilePic = cfg.DefaultAvatar
	user.AccountApproved = rawuser.AccountApproved
	user.IsActivated = rawuser.IsActivated

	return
}

// Save saves a serialized user to persistent storage
func Save(u *types.User, templateURL string) (errResponse error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	if token, e := GenVerificationToken(); e == nil {
		u.ActivationToken = token
		err := db.Create(u).Error

		if err != nil {
			return
		}

		// Prepare to send welcome email
		uprops := struct {
			Name  string
			Email string
			Token string
		}{u.Profile.Basics.Name, u.Email, token}

		welcomeMail := &bytes.Buffer{}
		wr := bufio.NewWriter(welcomeMail)

		err = email.GenActivationEmail(wr, uprops, templateURL)
		if err != nil {
			return
		}

		wr.Flush()

		mess := gomail.NewMessage()
		m := email.MailConfig{
			To:      []email.Receipient{{fmt.Sprintf("%s", uprops.Name), uprops.Email}},
			From:    mess.FormatAddress("support@talentsinafrica.com", "Talents Community"),
			Subject: "Welcome to TalentsInAfrica",
		}

		mailer, err := email.GetMailer(m, email.SendSingle)

		if err != nil {
			return err
		}

		// Send welcome email
		// defer send mail for 2minutes since user is active on resume creation page
		// push to queue
		work := types.WorkRequest{
			Payload: welcomeMail.Bytes(),
			Work: func(parameters interface{}) error {
				<-time.After(time.Minute * 2) //after 2 minutes, user might have finished signing up on resume page
				mail := parameters.([]byte)
				e := mailer.Send(mail)
				return e
			},
		}

		queue.WorkQueue <- work
	} else {
		errResponse = e
	}

	return errResponse
}

// Edit modifies a saved user's data
func Edit(u *types.User) error {
	db := database.GetMySQLInstance()
	defer db.Close()
	return db.Model(&types.User{}).Where("id LIKE ?", u.ID).Update(u).Error
}

// Delete removes a saved user from database
func Delete(u *types.User) error {
	db := database.GetMySQLInstance()
	return db.Close()
	return db.Unscoped().Delete(u).Error
}

// GenUserAccess takes a user role and returns a serialized Access object
func GenUserAccess(role string) (types.Access, error) {
	key, err := util.Gen32BitKey()

	if err != nil {
		return types.Access{}, err
	}

	r, err := util.EncryptString(key, []byte(role))

	if err != nil {
		return types.Access{}, err
	}

	return types.Access{key, r}, nil
}

// ActivateUser receives a username and activation code and activates a registered user
func ActivateUser(umail string, code string) error {
	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User

	err := db.Where("email LIKE ?", umail).First(&user).Error

	if err != nil {
		if err.Error() == "record not found" {
			return fmt.Errorf("user not found")
		}
		return err
	}

	if user.IsActivated {
		return nil
	}

	if user.ActivationToken == code {
		update := types.User{
			IsActivated: true,
		}

		err = db.Model(&user).Updates(update).Error
		if err != nil {
			return err
		}
	} else {
		err = fmt.Errorf("activation token mismatch")
	}

	return err
}
