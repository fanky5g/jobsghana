package config

import (
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetAWSSession(t *testing.T) {
	sess, err := GetAWSSession("us-west-2", "s3.amazonaws.com")
	assert.NoError(t, err)
	assert.NotNil(t, sess)
	assert.IsType(t, new(session.Session), sess)
}
