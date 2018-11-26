package types

import (
	"github.com/jinzhu/gorm"
)

// JobAlert subscribes jobseekers to receive mails when new jobs that match their search behavior is found
type JobAlert struct {
	gorm.Model
	Email string `json:"email"  gorm:"type:varchar(100);not null"`
}
