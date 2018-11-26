package types

import (
	"github.com/jinzhu/gorm"
)

// MailListSubscriber saves subscribers for mailing list on career advice page
type MailListSubscriber struct {
	gorm.Model
	Email string `json:"email"  gorm:"type:varchar(100);not null"`
}
