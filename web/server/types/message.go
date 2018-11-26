package types

import (
	"github.com/jinzhu/gorm"
)

// Message represents messages sent through socket
type Message struct {
	ID        string `json:"id"  key`
	Type      string `json:"type"`
	Sender    string `json:"sender"  unique:"true"`
	Recipient string `json:"recipient"  unique:"true"`
	Timestamp string `json:"ts"  sort:"true"`
	Read      bool   `json:"read"`
	Body      []byte `json:"payload"`
}

// ContactMessage represents messages sent through contact page
type ContactMessage struct {
	gorm.Model
	Name    string `json:"name"  gorm:"type:text;column:name;not null;"`
	Email   string `json:"email"  gorm:"type:varchar(50);column:email;not null"`
	Subject string `json:"subject"  gorm:"type:text;column:subject;not null"`
	Message string `json:"message"  gorm:"type:text;column:message;not null"`
	Read    bool   `json:"read" gorm:"type:boolean"`
}
