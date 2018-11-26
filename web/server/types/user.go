package types

import (
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/blevesearch/bleve"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"os"
	"reflect"
	"time"
)

var signingKey []byte

func init() {
	signingKey = []byte(os.Getenv("Secret"))
}

// User type holds application user
type User struct {
	gorm.Model
	UserID          string     `json:"user_id" validate:"false"`
	SignupStep      int        `json:"signup_step"  gorm:"type:int; default 0;"`
	Email           string     `json:"email" gorm:"index:email;type:varchar(100);column:email;not null"`
	Profile         JobProfile `json:"resume"  validate:"false" sql:"type:jsonb" gorm:"column:context;default null"`
	ProfilePic      string     `json:"avatar"  validate:"false"  gorm:"type:text;column:profile_pic;not null"`
	Password        string     `json:"password"  gorm:"type:text;column:password;not null"`
	Role            *Access    `json:"role" validate:"false"  sql:"type:jsonb" gorm:"column:role;not null"`
	AccountType     string     `json:"account_type" validate:"false" gorm:"index:account_type;type:varchar(100);column:account_type;not null"`
	AccountApproved bool       `json:"approved"  validate:"false"  gorm:"type:boolean"`
	Viewed          int        `json:"viewed"  validate:"false"  gorm:"type:int"`
	Downloaded      int        `json:"downloaded"  validate:"false"  gorm:"type:int"`
	IsActivated     bool       `json:"activated"  validate:"false"  gorm:"type:boolean"`
	ActivationToken string     `json:"-"  validate:"false" gorm:"type:text;column:activation_token;default null"`
}

// Value dummy doc
func (user User) Value() (driver.Value, error) {
	j, err := json.Marshal(user)
	return j, err
}

// Scan dummy doc
func (user *User) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("Type assertion .([]byte) failed")
	}

	err := json.Unmarshal(source, user)
	if err != nil {
		return errors.New("user unmarshal failed " + err.Error())
	}

	return nil
}

// GenerateJWTToken generates jwt string to be used to authenticate a request
func (user *User) GenerateJWTToken(issuer string, expire time.Duration) (string, error) {
	expireToken := expire.Nanoseconds()

	claims := Claims{
		Account: *user,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expireToken,
			Issuer:    issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(signingKey)
}

// EnsureFields validates user fields for required fields
func (user *User) EnsureFields(skip []string) error {
	l := reflect.ValueOf(*user).NumField()

	for i := 0; i < l; i++ {
		v := reflect.ValueOf(*user)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()

			if util.IsEmpty(v.Field(i).Interface()) {
				r, _ := t.Field(i).Tag.Lookup("validate")
				skipValidate := r == "false"

				for _, s := range skip {
					if s == t.Field(i).Name {
						skipValidate = true
						break
					}
				}

				if !t.Field(i).Anonymous && !skipValidate {
					return fmt.Errorf("field %s required but missing in %s struct", t.Field(i).Name, t.Name())
				}
			}
		}
	}
	return nil
}

// Meta holds additional resume account properties
type Meta struct {
	AttachedCVFile      string `json:"attached_cv,omitempty"`
	AttachedCoverLetter string `json:"attached_cl,omitempty"`
	SendUserUpdates     bool   `json:"signMeUpForUpdates"`
	Public              bool   `json:"public"`
}

// Access holds encrypted access control fields
type Access struct {
	Key  []byte `json:"key"`
	Role []byte `json:"role"`
}

// Value dummy doc
func (a Access) Value() (driver.Value, error) {
	j, err := json.Marshal(a)
	return j, err
}

// Scan dummy doc
func (a *Access) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("Type assertion .([]byte) failed")
	}

	err := json.Unmarshal(source, a)
	if err != nil {
		return errors.New("Type assertion .(Access{}) failed " + err.Error())
	}

	return nil
}

// // Value dummy doc
// func (a Meta) Value() (driver.Value, error) {
// 	j, err := json.Marshal(a)
// 	return j, err
// }

// // Scan dummy doc
// func (a *Meta) Scan(src interface{}) error {
// 	source, ok := src.([]byte)
// 	if !ok {
// 		return errors.New("Type assertion .([]byte) failed")
// 	}

// 	err := json.Unmarshal(source, a)
// 	if err != nil {
// 		return errors.New("meta unmarshal failed " + err.Error())
// 	}

// 	return nil
// }

// Index indexes a user account so we can search
func (user *User) Index(index bleve.Index) error {
	u2Index := map[string]interface{}{
		"id":                user.ID,
		"jobSector":         user.Profile.Preferences.JobSector,
		"jobTitle":          user.Profile.Basics.JobTitle,
		"level":             user.Profile.Preferences.Level,
		"salaryExpectation": user.Profile.Preferences.SalaryExpectation,
		"location":          user.Profile.Basics.Location,
		"pref_loc":          user.Profile.Preferences.Location,
		"jobType":           user.Profile.Preferences.JobType,
	}

	if user.Profile.Preferences.JobSector == "other" && user.Profile.Preferences.JobSectorAlt != "" {
		u2Index["jobSector"] = user.Profile.Preferences.JobSectorAlt
	}

	err := index.Index(user.Profile.Preferences.JobSector, u2Index)

	return err
}

// Claims type holds authentication standards and expiration
type Claims struct {
	Account User
	jwt.StandardClaims
}
