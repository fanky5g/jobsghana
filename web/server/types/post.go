package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
	"time"
)

//Images holds multiple s3 file objects
type Images []FileMetadata

// Value dummy doc
func (c Images) Value() (driver.Value, error) {
	j, err := json.Marshal(c)
	return j, err
}

// Scan dummy doc
func (c *Images) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("Type assertion .([]byte) failed")
	}

	var i []interface{}
	err := json.Unmarshal(source, &i)
	if err != nil {
		return err
	}

	for _, v := range i {
		var file FileMetadata
		decodeFileFromSQLJSON(v.(map[string]interface{}), &file)
		if err != nil {
			log.Println(err)
		}
		*c = append(*c, file)
	}

	return nil
}

// RawPost holds fields for a new post
type RawPost struct {
	Author           User           `json:"author"`
	Title            string         `json:"title"`
	ShortURL         string         `json:"shorturl"`
	Type             string         `json:"type"`
	Abstract         string         `json:"abstract"`
	Content          string         `json:"content"`
	Tags             string         `json:"tags"`
	IPOwner          string         `json:"ip_owner"`
	HeaderImageIndex *int           `json:"headerImageIndex"`
	ReadNext         string         `json:"readNext"`
	Attached         []FileMetadata `json:"attached"`
	PubDate          time.Time      `json:"date"`
}

// Post holds fields for blog post
type Post struct {
	gorm.Model
	Author           *User          `json:"author" sql:"type:jsonb" gorm:"column:author;not null"`
	IPOwner          string         `json:"ip_owner"  gorm:"type:text"`
	Title            string         `json:"title"  gorm:"type:text"`
	ShortURL         string         `json:"shorturl"  gorm:"type:text;column:shorturl"`
	Type             string         `json:"type"  gorm:"type:varchar(120)"`
	Abstract         string         `json:"abstract"  gorm:"type:text;not null;column:abstract"`
	Content          string         `json:"content"  gorm:"type:text;not null;column:content"`
	Published        bool           `json:"published" gorm:"type:boolean"`
	Tags             pq.StringArray `json:"tags,omitempty"  gorm:"type:varchar(64)[]"`
	HeaderImageIndex *int           `json:"headerImageIndex"`
	PubDate          time.Time      `json:"pub_date"  gorm:"type:timestamp"`
	ReadNext         pq.StringArray `json:"readNext,omitempty"  gorm:"type:varchar(64)[]"`
	Images           Images         `json:"images"    gorm:"column:images;default null;"  sql:"type:jsonb"`
}

func decodeFileFromSQLJSON(file map[string]interface{}, out *FileMetadata) {
	if _, ok := file["ID"]; ok {
		out.ID = uint(file["ID"].(float64))
	}

	if _, ok := file["key"]; ok {
		out.Key = file["key"].(string)
	}

	if _, ok := file["url"]; ok {
		out.URL = file["url"].(string)
	}

	if _, ok := file["mime"]; ok {
		out.MimeType = file["mime"].(string)
	}

	if _, ok := file["size"]; ok {
		out.FileSize = uint64(file["size"].(float64))
	}

	if _, ok := file["width"]; ok {
		out.Width = uint32(file["width"].(float64))
	}

	if _, ok := file["bucket"]; ok {
		out.Bucket = file["bucket"].(string)
	}

	if _, ok := file["height"]; ok {
		out.Height = uint32(file["height"].(float64))
	}

	if _, ok := file["authorID"]; ok {
		out.AuthorID = uint8(file["authorID"].(float64))
	}

	if _, ok := file["fileName"]; ok {
		out.FileName = file["fileName"].(string)
	}

	if _, ok := file["imageType"]; ok {
		out.ImageType = file["imageType"].(string)
	}
}
