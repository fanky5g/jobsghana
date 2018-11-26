package blog

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"errors"
	"github.com/ahmetb/go-linq"
	"github.com/jinzhu/gorm"
	"strings"
)

// GetPostTypes returns saved blog types
func GetPostTypes() ([]types.PostType, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var postTypes []types.PostType

	err := db.Model(&types.PostType{}).Find(&postTypes).Error
	if err != nil {
		return postTypes, err
	}

	return postTypes, nil
}

// GroupPostsByType groups posts by type
func GroupPostsByType(posts []types.Post) map[string][]interface{} {
	grouped := linq.From(posts).GroupBy(func(post interface{}) interface{} {
		return post.(types.Post).Type
	}, func(post interface{}) interface{} {
		return post
	})

	out := make(map[string][]interface{})

	for _, v := range grouped.Results() {
		group := v.(linq.Group)
		out[group.Key.(string)] = group.Group
	}

	return out
}

// AddPostType adds a post type
func AddPostType(postType types.PostType) (*types.PostType, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	name := strings.ToLower(postType.Name)
	var found types.PostType
	err := db.Model(&types.PostType{}).Where("name LIKE ?", name).First(&found).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	if !util.IsEmpty(found) {
		return nil, errors.New("Type already exists")
	}

	postType.Name = name
	err = db.Create(&postType).Error
	if err != nil {
		return nil, err
	}

	return &postType, nil
}

// DeletePostType deletes a blog post type
func DeletePostType(id uint) error {
	db := database.GetMySQLInstance()
	defer db.Close()

	return db.Unscoped().Delete(&types.PostType{}, "id = ?", id).Error
}
