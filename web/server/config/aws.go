package config

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
)

// GetAWSSession creates and returns a new AWS session
func GetAWSSession(region, endpoint string) (*session.Session, error) {
	cfg, err := GetConfig()
	if err != nil {
		return nil, err
	}

	creds := credentials.NewStaticCredentials(
		cfg.AWSAccessKeyID,
		cfg.AWSSecretKey,
		cfg.AWSToken,
	)

	config := &aws.Config{
		Credentials: creds,
		Region:      aws.String(region),
		Endpoint:    aws.String(endpoint),
	}

	if endpoint == "s3.amazonaws.com" {
		config.S3ForcePathStyle = aws.Bool(true)
	}

	sess := session.New(config)
	return sess, nil
}
