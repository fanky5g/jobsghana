package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/blog"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/labstack/echo"
)

// GetPosts gets all blog posts
func (h *Handlers) GetPosts(c echo.Context) error {
	posts, err := blog.GetPosts()
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	types, err := blog.GetPostTypes()
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	out := map[string]interface{}{
		"posts":   posts,
		"types":   types,
		"grouped": blog.GroupPostsByType(posts),
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(out)
}

// GetPost gets a single blog post by shorturl
func (h *Handlers) GetPost(c echo.Context) error {
	post, err := blog.GetPost(map[string]interface{}{"shorturl": c.Param("shorturl")})
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(post)
}

// GetRelatedPosts gets all related posts
func (h *Handlers) GetRelatedPosts(c echo.Context) error {
	posts, err := blog.GetRelatedPosts(c.Param("shorturl"))
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(posts)
}

// CreatePost adds a new post
func (h *Handlers) CreatePost(c echo.Context) error {
	upFiles := c.Get("files")
	var uploaded []types.FileMetadata
	if upFiles != nil {
		uploaded = upFiles.([]types.FileMetadata)
	}

	post, err := buildRawPost(c)
	if err != nil {
		defer h.S3Client.DeleteFiles(h.Conf.UString("Bucket"), uploaded)
		logger.Println(err)
		c.Error(err)
		return err
	}

	var headerImage types.FileMetadata

	if len(uploaded) > 0 && post.HeaderImageIndex != nil {
		headerImage = uploaded[*post.HeaderImageIndex]
		firstHalf := uploaded[:*post.HeaderImageIndex]
		var nextHalf []types.FileMetadata
		if len(uploaded) >= *post.HeaderImageIndex+1 {
			nextHalf = uploaded[*post.HeaderImageIndex+1:]
		}

		uploaded = append(firstHalf, nextHalf...)
	}

	author, err := auth.GetAuthenticatedUser(c)
	if err != nil {
		defer h.S3Client.DeleteFiles(h.Conf.UString("Bucket"), uploaded)
		logger.Println(err)
		c.Error(err)
		return err
	}

	created, err := blog.CreatePost(uploaded, *author, post, headerImage)
	if err != nil {
		defer h.S3Client.DeleteFiles(h.Conf.UString("Bucket"), uploaded)
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(returnMsg{Success: true, Message: "post created", Body: map[string]interface{}{
		"post": created,
	}})
}

// UpdatePost updates a post
func (h *Handlers) UpdatePost(c echo.Context) error {
	upFiles := c.Get("files")
	var uploaded []types.FileMetadata
	if upFiles != nil {
		uploaded = upFiles.([]types.FileMetadata)
	}

	var rawPost types.RawPost

	// get formdata fields and manually set rawpost
	rawPost, err := buildRawPost(c)
	if err != nil {
		defer h.S3Client.DeleteFiles(h.Conf.UString("Bucket"), uploaded)
		logger.Println(err)
		c.Error(err)
		return err
	}

	var attachments []types.FileMetadata

	for _, attachment := range rawPost.Attached {
		if attachment.Key != "" {
			attachments = append(attachments, attachment)
		} else {
			// find newly uploaded file
			for _, v := range uploaded {
				if v.FileName == attachment.FileName {
					attachments = append(attachments, v)
					break
				}
			}
		}
	}

	headerImage := attachments[*rawPost.HeaderImageIndex]
	firstHalf := attachments[:*rawPost.HeaderImageIndex]
	var nextHalf []types.FileMetadata
	if len(attachments) >= *rawPost.HeaderImageIndex+1 {
		nextHalf = attachments[*rawPost.HeaderImageIndex+1:]
	}

	attachments = append(firstHalf, nextHalf...)

	post := types.Post{
		Author:           &rawPost.Author,
		Title:            rawPost.Title,
		ShortURL:         rawPost.ShortURL,
		Type:             rawPost.Type,
		Abstract:         rawPost.Abstract,
		Content:          rawPost.Content,
		Tags:             blog.CleanTags(rawPost.Tags),
		HeaderImageIndex: rawPost.HeaderImageIndex,
		ReadNext:         []string{rawPost.ReadNext},
		PubDate:          rawPost.PubDate,
		IPOwner:          rawPost.IPOwner,
		// do not set images yet
	}

	updatedPost, err := blog.UpdatePost(rawPost.ShortURL, attachments, post, headerImage, h.S3Client)
	if err != nil {
		defer h.S3Client.DeleteFiles(h.Conf.UString("Bucket"), uploaded)
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(returnMsg{Success: true, Message: "Post Edit Successful", Body: map[string]interface{}{
		"post": updatedPost,
	}})
}

// DeletePost deletes a post
func (h *Handlers) DeletePost(c echo.Context) error {
	shorturl := c.Param("shorturl")
	result, err := blog.DeletePost(shorturl, h.S3Client)
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(result)
}

// PublishPost publishes a blog post
func (h *Handlers) PublishPost(c echo.Context) error {
	post, err := blog.PublishPost(c.Param("shorturl"))
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(post)
}

// UnpublishPost unpublishes a blog post
func (h *Handlers) UnpublishPost(c echo.Context) error {
	post, err := blog.UnpublishPost(c.Param("shorturl"))
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(post)
}

// CreatePostType creates a blog post type
func (h *Handlers) CreatePostType(c echo.Context) error {
	var postType types.PostType
	err := c.Bind(&postType)
	if err != nil {
		c.Error(err)
		return err
	}

	created, err := blog.AddPostType(postType)
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(created)
}

// DeletePostType deletes a post type
func (h *Handlers) DeletePostType(c echo.Context) error {
	idRaw := c.Param("id")
	if idRaw == "" {
		errorString := errors.New("missing id")
		c.Error(errorString)
		return errorString
	}

	id, err := strconv.ParseUint(idRaw, 10, 64)
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	err = blog.DeletePostType(uint(id))
	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	return json.NewEncoder(c.Response()).Encode(returnMsg{Success: true, Body: map[string]interface{}{
		"id": id,
	}})
}

func buildRawPost(c echo.Context) (post types.RawPost, err error) {
	post.Abstract = c.FormValue("abstract")
	post.Title = c.FormValue("title")
	post.ShortURL = c.FormValue("shorturl")
	post.Type = c.FormValue("type")
	post.Content = c.FormValue("content")
	post.Tags = c.FormValue("tags")
	post.ReadNext = c.FormValue("readNext")
	post.IPOwner = c.FormValue("ip_owner")

	attachedBytes := []byte(c.FormValue("attached"))
	if len(attachedBytes) > 0 {
		var attached []types.FileMetadata
		e := json.Unmarshal(attachedBytes, &attached)
		if e != nil {
			logger.Println(e)
			return post, e
		}

		post.Attached = attached
	}

	tryParseTime := func(p string) (time.Time, error) {
		pubDate, err := time.Parse("Mon Jan _2 15:04:05 2006", c.FormValue("date"))
		if err != nil {
			return time.Time{}, err
		}
		pubDate, err = time.Parse("Mon Jan _2 2006 15:04:05 GMT+0000 (GMT)", "Thu Oct 19 2017 06:36:43 GMT+0000 (GMT)")
		if err != nil {
			return time.Time{}, err
		}
		return pubDate, nil
	}

	pubDate, err := tryParseTime(c.FormValue("date"))
	if err != nil {
		return post, err
	}

	post.PubDate = pubDate

	headerIndexString := c.FormValue("headerImage")
	index, err := strconv.Atoi(headerIndexString)
	if err != nil {
		return post, err
	}

	post.HeaderImageIndex = &index

	return post, nil
}
