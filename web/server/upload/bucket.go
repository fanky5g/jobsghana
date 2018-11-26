package upload

import (
	"errors"

	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
)

var (
	//ErrBucketEmpty is an error that returns when an operation is supplied with an empty bucket name
	ErrBucketEmpty = errors.New("BucketName must be a non-empty string")
)

// CreateS3Bucket creates an s3 bucket in the default region
func (a *S3Agent) CreateS3Bucket(BucketName string) (*s3.CreateBucketOutput, error) {
	if BucketName == "" {
		return nil, ErrBucketEmpty
	}

	bucketInput := &s3.CreateBucketInput{Bucket: &BucketName}

	return a.CreateBucket(bucketInput)
}

// DeleteS3Bucket removes existing s3 bucket in the default region
func (a *S3Agent) DeleteS3Bucket(BucketName string) (*s3.DeleteBucketOutput, error) {
	err := bucketExists(a, BucketName, false)
	if err != nil {
		return nil, err
	}

	if BucketName == "" {
		return nil, ErrBucketEmpty
	}

	bucketInput := &s3.DeleteBucketInput{Bucket: &BucketName}

	return a.DeleteBucket(bucketInput)
}

// EmptyBucket empties the specified s3 bucket
func (a *S3Agent) EmptyBucket(bucket string) (*s3.DeleteObjectsOutput, error) {
	err := bucketExists(a, bucket, false)
	if err != nil {
		return nil, err
	}

	if bucket == "" {
		return nil, ErrBucketEmpty
	}

	listOut, err := a.ListObjects(&s3.ListObjectsInput{
		Bucket: &bucket,
	})

	if err != nil {
		return nil, err
	}

	// bucket empty, do nothing
	if len(listOut.Contents) == 0 {
		return nil, nil
	}

	var deleteArray []*s3.ObjectIdentifier
	for _, v := range listOut.Contents {
		deleteArray = append(deleteArray, &s3.ObjectIdentifier{Key: v.Key})
	}

	return a.DeleteMultiple(bucket, deleteArray)
}

// DeleteFiles deletes file array
func (a *S3Agent) DeleteFiles(bucket string, files []types.FileMetadata) (*s3.DeleteObjectsOutput, error) {
	var objects []*s3.ObjectIdentifier
	for _, file := range files {
		objects = append(objects, &s3.ObjectIdentifier{
			Key: aws.String(file.Key),
		})
	}

	return a.DeleteMultiple(bucket, objects)
}
