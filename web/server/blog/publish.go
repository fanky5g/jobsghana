package blog

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"errors"
	"github.com/jinzhu/gorm"
)

// PublishPost publishes a blog post
func PublishPost(shorturl string) (types.Post, error) {
	db := database.GetMySQLInstance()
	defer db.Close()
	var post types.Post
	err := db.Where("shorturl LIKE ?", shorturl).First(&post).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		return post, errors.New("post not found")
	}

	err = db.Model(&post).Updates(map[string]interface{}{"published": true}).Error
	if err != nil {
		return post, err
	}

	post.Published = true
	return post, nil
}

// UnpublishPost unpublishes a blog post
func UnpublishPost(shorturl string) (types.Post, error) {
	db := database.GetMySQLInstance()
	defer db.Close()
	var post types.Post
	err := db.Where("shorturl LIKE ?", shorturl).First(&post).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		return post, errors.New("post not found")
	}

	err = db.Model(&post).Updates(map[string]interface{}{"published": false}).Error
	if err != nil {
		return post, err
	}
	post.Published = false
	return post, nil
}
