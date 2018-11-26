package types

import (
	"github.com/jinzhu/gorm"
)

// File encloses file properties
type File struct {
	Bucket   string
	Key      string
	FileName string
	Location string
	Size     uint64
	AuthorID uint8
}

//FileMetadata type returns File metadata for uploaded files
type FileMetadata struct {
	gorm.Model
	FileName string `json:"fileName"  editable:"true"`
	Key      string `json:"key" unique:"true"`
	FileSize uint64 `json:"size"  editable:"true"`
	MimeType string `json:"mime"  editable:"true"`
	Bucket   string `json:"bucket"  editable:"true"`
	URL      string `json:"url" unique:"true"`

	// Owner User
	AuthorID uint8 `json:"authorID"`

	// image fields, omitted if not set
	Width     uint32 `json:"width, omitempty"  validate:"false"  editable:"true"`
	Height    uint32 `json:"height, omitempty"  validate:"false"  editable:"true"`
	ImageType string `json:"imageType, omitempty"  validate:"false"  editable:"true"`
}
