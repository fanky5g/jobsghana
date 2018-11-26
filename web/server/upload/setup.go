package upload

import (
	conf "github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"os"
	"reflect"
)

var (
	config   = &aws.Config{}
	sess     = &session.Session{}
	s3Client = &s3.S3{}
	envVars  = make(map[string]string)
	agent    *S3Agent
)

// AWSConfig holds aws environment variables
type AWSConfig struct {
	AWSAccessKeyID string
	AWSSecretKey   string
	AWSToken       string
	BucketRegion   string
	Bucket         string
}

// CreateClient creates S3 transaction client
func CreateClient(cfg *AWSConfig, bucket string, fileDB string) (*S3Agent, error) {
	creds := credentials.NewStaticCredentials(
		cfg.AWSAccessKeyID,
		cfg.AWSSecretKey,
		cfg.AWSToken,
	)
	_, err := creds.Get()

	if err != nil {
		return &S3Agent{}, err
	}

	config = &aws.Config{
		Credentials:      creds,
		Region:           aws.String(cfg.BucketRegion),
		Endpoint:         aws.String("s3.amazonaws.com"),
		S3ForcePathStyle: aws.Bool(true),
	}

	isLocalDev := os.Getenv("TALENTSINAFRICA_LOCAL_DEV") == "true"
	isS3Local := os.Getenv("S3LOCAL") == "true"
	if isLocalDev && isS3Local {
		config.Endpoint = aws.String("http://localhost:4567/")
	}

	sess = session.New(config)
	s3Client = s3.New(sess)

	agent = &S3Agent{s3Client, sess, cfg.BucketRegion, bucket, fileDB}
	return agent, nil
}

func bucketExists(s3Client *S3Agent, bucket string, forceCreate bool) error {
	// check if bucket exists to prevent future errors
	_, err := s3Client.HeadBucket(&s3.HeadBucketInput{
		Bucket: &bucket,
	})

	if err != nil && err.Error() == s3.ErrCodeNoSuchBucket && forceCreate {
		// Bucket does not exist-try create bucket
		_, err = agent.CreateS3Bucket(bucket)
		if err != nil {
			return fmt.Errorf("Bucket %s does not exist. Attempt to create bucket resulted in error %s", bucket, err)
		}

		fmt.Printf("New bucket %s created in %s\n", bucket, s3Client.BucketRegion)
	}

	return err
}

// GetConfig returns AWSConfig
func GetConfig() (*AWSConfig, error) {
	c, err := conf.GetRawConfig()

	if err != nil {
		return nil, err
	}

	var cfg *AWSConfig
	l := reflect.ValueOf(cfg).NumField()
	for i := 0; i < l; i++ {
		v := reflect.ValueOf(cfg)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()
			fieldname := t.Field(i).Name
			val := c.UString(fieldname)
			util.SetField(&cfg, fieldname, val)
		}
	}

	return cfg, nil
}
