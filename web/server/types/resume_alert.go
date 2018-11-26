package types

import (
	"github.com/jinzhu/gorm"
	"time"
)

// ResumeAlert subscribes recruiters to receive mails when jobseekers match their need
type ResumeAlert struct {
	gorm.Model
	Email          string    `json:"email"  gorm:"type:varchar(100)"`
	AlertFrom      time.Time `json:"alertFrom"  gorm:"type:timestamp;not null"`
	AlertTo        time.Time `json:"alertTo"  gorm:"type:timestamp;not null"`
	JobTitle       string    `json:"jobTitle"  gorm:"type:text;not null"`
	WorkExperience uint      `json:"experience"  gorm:"type:int;not null"`
	Location       string    `json:"location"  gorm:"type:varchar(50);default 0"`
	CompanyName    string    `json:"companyName"  gorm:"type:text;not null"`
}
