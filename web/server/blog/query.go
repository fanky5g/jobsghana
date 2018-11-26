package blog

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	// "fmt"
	"github.com/ahmetb/go-linq"
	"github.com/jinzhu/gorm"
	// "strings"
)

// QueryPost finds a post based on passed parameters
func QueryPost(query map[string]interface{}) ([]types.Post, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var posts []types.Post

	if _, ok := query["published"]; !ok {
		query["published"] = true
	}

	var err error
	if len(query) == 0 {
		err = db.Find(&posts).Error
	} else {
		err = db.Where(query).Find(&posts).Error
	}

	if err != nil && err == gorm.ErrRecordNotFound {
		return posts, nil //empty posts
	}

	// catch other errors
	if err != nil {
		return posts, err
	}

	return posts, nil
}

// GetPost returns first post based on query specified
func GetPost(query map[string]interface{}) (*types.Post, error) {
	posts, err := QueryPost(query)
	if err != nil {
		return nil, err
	}

	if len(posts) == 0 {
		return nil, ErrPostNotFound
	}

	return &posts[0], nil
}

// GetPosts gets all posts matching query
// implement pagination later
func GetPosts() ([]types.Post, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var posts []types.Post
	err := db.Find(&posts).Limit(50).Error

	return posts, err
}

// GetRelatedPosts gets posts similar to post shorturl parameter
func GetRelatedPosts(shorturl string) ([]types.Post, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var posts []types.Post

	post, err := GetPost(map[string]interface{}{"shorturl": shorturl})
	if err != nil {
		return posts, err
	}

	if post == nil {
		return posts, nil
	}

	// if len(post.Tags) > 1 {
	// r := "(" + strings.Join(strings.Split(strings.Repeat("?", len(post.Tags)), ""), ",") + ")"
	// err = db.Where(fmt.Sprintf("tags in %s", r), post.Tags).Where("published = ?", true).Find(&posts).Error
	// } else if len(post.Tags) == 1 {
	// 	err = db.Where("tags in (?)", post.Tags[0]).Find(&posts).Error
	// }

	err = db.Where("tags in (?)", post.Tags).Find(&posts).Error
	if err != nil {
		return posts, err
	}

	var out []types.Post

	linq.From(posts).Where(func(post interface{}) bool {
		return post.(types.Post).ShortURL != shorturl
	}).ToSlice(&out)

	return out, nil
}

// QueryDrafts returns all unpublished posts
func QueryDrafts(query map[string]interface{}) ([]types.Post, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var posts []types.Post

	query["published"] = false
	err := db.Where(query).Find(&posts).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		return posts, nil //empty drafts
	}

	// catch other errors
	if err != nil {
		return posts, err
	}

	return posts, nil
}
