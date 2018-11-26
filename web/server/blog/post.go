package blog

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/log"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"errors"
	"github.com/jinzhu/gorm"
)

// DeletePost deletes a blog post
func DeletePost(shorturl string, s3Agent *upload.S3Agent) (interface{}, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var post types.Post
	err := db.Where("shorturl LIKE ?", shorturl).First(&post).Error

	if err != nil && err == gorm.ErrRecordNotFound {
		return nil, ErrPostNotFound
	}

	successReturn := map[string]interface{}{"msg": "success", "pid": post.ID}

	_, err = s3Agent.DeleteFiles(s3Agent.BucketName, post.Images)
	if err != nil {
		return nil, ErrResourceRemoveFailure
	}

	err = db.Unscoped().Delete(&post).Error
	if err != nil {
		log.Debug(err)
		return nil, ErrResourceRemoveFailure
	}

	return successReturn, nil
}

// CreatePost creates a new post
func CreatePost(images []types.FileMetadata, author types.User, p types.RawPost, headerImage types.FileMetadata) (interface{}, error) {
	if p.ShortURL == "new" {
		return nil, errors.New("the title `new` is reserved")
	}

	var post types.Post
	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Where("shorturl LIKE ?", p.ShortURL).First(&post).Error
	if err != gorm.ErrRecordNotFound {
		return nil, errors.New("post with similar title already exists..be unique")
	}

	if p.HeaderImageIndex == nil {
		p.HeaderImageIndex = &EmptyHeaderIndex
	}

	post = types.Post{
		Author:           &author,
		Title:            p.Title,
		ShortURL:         p.ShortURL,
		Type:             p.Type,
		Abstract:         p.Abstract,
		Content:          p.Content,
		PubDate:          p.PubDate,
		Tags:             CleanTags(p.Tags),
		HeaderImageIndex: p.HeaderImageIndex,
		ReadNext:         []string{p.ReadNext},
		IPOwner:          p.IPOwner,
	}

	// headerImage was seperated from other images in handler earlier so we can
	// process headerImage differently later
	// @todo: func resolveHeaderImage

	post, err = resolveAttachments(images, post, *post.HeaderImageIndex, headerImage, true)
	if err != nil {
		return nil, err
	}

	err = createPost(&post, db)
	if err != nil {
		return nil, err
	}

	return post, nil
}

// UpdatePost updates a post
func UpdatePost(shorturl string, images []types.FileMetadata, post types.Post, headerImage types.FileMetadata, s3Agent *upload.S3Agent) (interface{}, error) {
	var postItem types.Post

	post.ShortURL = ""

	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Where("shorturl LIKE ?", shorturl).First(&postItem).Error
	if err == gorm.ErrRecordNotFound {
		return nil, ErrPostNotFound
	}

	prevImages := postItem.Images
	insert := func(s []types.FileMetadata, at int, val types.FileMetadata) []types.FileMetadata {
		s = append(s[:at+1], s[at:]...)
		s[at] = val
		return s
	}

	var imagesCombined []types.FileMetadata

	if len(images) > 0 {
		imagesCombined = insert(images, *post.HeaderImageIndex, headerImage)
	} else {
		imagesCombined = append(imagesCombined, headerImage)
	}

	var imageSources []string
	var imagesToClear []types.FileMetadata
	for _, image := range imagesCombined {
		imageSources = append(imageSources, image.Key)
	}

	for _, image := range prevImages {
		var found bool
		for _, key := range imageSources {
			if key == image.Key {
				found = true
				break
			}
		}

		if !found {
			imagesToClear = append(imagesToClear, image)
		}
	}

	// delete removed images
	if len(imagesToClear) > 0 {
		_, err = s3Agent.DeleteFiles(s3Agent.BucketName, imagesToClear)
		if err != nil {
			return nil, ErrResourceRemoveFailure
		}
	}

	updated, err := resolveAttachments(imagesCombined, post, *post.HeaderImageIndex, headerImage, false)
	if err != nil {
		return nil, err
	}

	err = db.Model(&postItem).Updates(updated).Error
	if err != nil {
		return nil, err
	}

	return updated, nil
}

func createPost(post *types.Post, db *gorm.DB) error {
	return db.Create(post).Error
}
