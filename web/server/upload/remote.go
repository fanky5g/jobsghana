package upload

import (
	"github.com/fanky5g/xxxinafrica/web/server/files"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"errors"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"io"
	"log"
	"time"
)

var (
	//ErrBodyEmpty returns when upload is called with an empty body
	ErrBodyEmpty = errors.New("Expected body to not be empty")
	//ErrKeyEmpty is an error that returns when an operation is supplied with an empty key
	ErrKeyEmpty = errors.New("Key cannot be empty")
)

// CreateFile creates a new file object on AWS and returns a Metadata type
func (a *S3Agent) createFile(r *io.PipeReader, key string) (*s3manager.UploadOutput, error) {
	err := bucketExists(a, a.BucketName, true)
	if err != nil {
		return nil, err
	}

	uploader := s3manager.NewUploader(a.Session)
	object := &s3manager.UploadInput{
		Body:   r,
		Bucket: &a.BucketName,
		ACL:    aws.String("public-read"),
		Key:    &key,
	}

	return uploader.Upload(object)
}

// Upload takes a request object and an optional key parameter and returns an UploadOutput object
func (a *S3Agent) Upload(body io.Reader, data interface{}) (types.FileMetadata, error) {
	if body == nil {
		return types.FileMetadata{}, ErrBodyEmpty
	}

	filename, ok := data.(string)

	if !ok {
		return types.FileMetadata{}, errors.New("filename empty")
	}

	reader, writer := io.Pipe()
	var size uint64

	go func() {
		defer writer.Close()
		s, err := io.Copy(writer, body)
		if err != nil {
			log.Fatal(err)
		}

		size = uint64(s)
	}()

	key := "images/" + util.GenUniqueFileKey(filename)
	ret, err := a.createFile(reader, key)

	if err != nil {
		return types.FileMetadata{}, err
	}

	formatted := files.FormatFile(&types.File{
		Bucket:   a.BucketName,
		Size:     size,
		Key:      key,
		FileName: filename,
		Location: ret.Location,
	})

	return formatted, err
}

// GetSignedURL returns downloadable file path for a private file
func (a *S3Agent) GetSignedURL(bucket, key string) (*string, error) {
	err := bucketExists(a, a.BucketName, false)
	if err != nil {
		return nil, err
	}

	if bucket == "" {
		return nil, ErrBucketEmpty
	}

	if key == "" {
		return nil, ErrKeyEmpty
	}

	input := &s3.GetObjectInput{
		Bucket: &bucket,
		Key:    &key,
	}

	req, _ := a.GetObjectRequest(input)
	expiry := time.Now().Add(time.Hour * time.Duration(24)).String()
	dur, err := time.ParseDuration(expiry)

	signed, err := req.Presign(dur)
	return &signed, err
}

// GetFile gets file object from AWS and returns a readcloser
func (a *S3Agent) GetFile(bucket, key string) (out io.ReadCloser, length int64, err error) {
	err = bucketExists(a, a.BucketName, false)
	if err != nil {
		return out, length, err
	}

	if bucket == "" {
		return out, length, ErrBucketEmpty
	}

	if key == "" {
		return out, length, ErrKeyEmpty
	}

	o, err := a.GetObject(&s3.GetObjectInput{
		Bucket: &bucket,
		Key:    &key,
	})

	if err != nil {
		return out, length, err
	}

	return o.Body, *o.ContentLength, err
}

// DeleteMultiple deletes an array of s3 objects in a slice of *s3.ObjectIdentifier
func (a *S3Agent) DeleteMultiple(bucket string, objects []*s3.ObjectIdentifier) (*s3.DeleteObjectsOutput, error) {
	err := bucketExists(a, a.BucketName, false)
	if err != nil {
		return nil, err
	}

	out, err := a.DeleteObjects(&s3.DeleteObjectsInput{
		Bucket: &bucket,
		Delete: &s3.Delete{
			Objects: objects,
		},
	})
	return out, err
}

// DeleteFile deletes an s3 object and return a boolean of true if deleted
func (a *S3Agent) DeleteFile(bucket, key string) (bool, error) {
	err := bucketExists(a, a.BucketName, false)
	if err != nil {
		return false, err
	}

	if bucket == "" {
		return false, ErrBucketEmpty
	}

	if key == "" {
		return false, ErrKeyEmpty
	}

	_, err = a.DeleteObject(&s3.DeleteObjectInput{
		Bucket: &bucket,
		Key:    &key,
	})

	if err != nil {
		return false, err
	}

	return true, nil
}
