package document

// LResumeParserInput holds fields for calling lambda resume parser function online
type LResumeParserInput struct {
	Bucket         string `json:"bucket"`
	Key            string `json:"key"`
	AWSAccessKeyID string `json:"AWS_ACCESS_KEY_ID"`
	AWSSecretKey   string `json:"AWS_SECRET_KEY"`
}
