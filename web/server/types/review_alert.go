package types

import (
	"github.com/jinzhu/gorm"
)

// ReviewAlert subscribes jobseekers to receive mails when recruiters view their profiles
type ReviewAlert struct {
	gorm.Model
	Email string `json:"email"  gorm:"type:varchar(100)"`
}
