package types

import (
	"github.com/jinzhu/gorm"
)

// PostType specifies category of post
type PostType struct {
	gorm.Model
	Name string `json:"type"  gorm:"type:text"`
}
