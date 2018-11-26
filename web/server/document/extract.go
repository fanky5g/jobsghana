package document

import (
	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"bytes"
	"encoding/json"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/lambda"
	"regexp"
	"strconv"
)

// ParseResume parses a resume and returns fields
func ParseResume(key string) (*types.Resume, error) {
	b, err := parseResume(key)
	if err != nil {
		return nil, err
	}

	clean, err := strconv.Unquote(string(cleanString(string(b))))
	if err != nil {
		return nil, err
	}

	resumeJSON, err := json.RawMessage(clean).MarshalJSON()
	if err != nil {
		return nil, err
	}

	var resume *types.Resume

	err = json.Unmarshal(resumeJSON, &resume)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

func parseResume(key string) ([]byte, error) {
	sess, err := config.GetAWSSession("us-west-2", "lambda.us-west-2.amazonaws.com")
	if err != nil {
		return []byte{}, err
	}

	cfg, _ := config.GetConfig()

	testData := LResumeParserInput{
		Bucket:         cfg.Bucket,
		Key:            key,
		AWSAccessKeyID: cfg.AWSAccessKeyID,
		AWSSecretKey:   cfg.AWSSecretKey,
	}

	w := &bytes.Buffer{}
	r := json.NewEncoder(w)

	err = r.Encode(testData)
	if err != nil {
		return []byte{}, err
	}

	svc := lambda.New(sess)
	input := &lambda.InvokeInput{
		FunctionName:   aws.String("LResumeParser"),
		InvocationType: aws.String("RequestResponse"),
		LogType:        aws.String("Tail"),
		Payload:        w.Bytes(),
	}

	result, err := svc.Invoke(input)
	return result.Payload, err
}

func cleanString(inputString string) []byte {
	r, err := regexp.Compile(`(\n+)?(\s+)?(page\s?\d+|PAGE\s?\d+|Page\s?\d+)`)
	if err != nil {
		panic(err)
	}

	clean := r.ReplaceAllString(inputString, "")
	return []byte(clean)
}
