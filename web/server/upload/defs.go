package upload

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"io"
)

//Uploader eg. video, mp3, document struct types must implement this interface to satisty UploadFile operation
type Uploader interface {
	Upload(body io.Reader, data interface{}) (*types.FileMetadata, error)
}

// S3Agent s3 object containing useful file manipulation operations
type S3Agent struct {
	*s3.S3
	Session      *session.Session
	BucketRegion string
	BucketName   string
	fileDB       string
}
