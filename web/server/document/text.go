package document

import (
	"github.com/sajari/docconv"
)

// ExtractText extracts text from a document
func ExtractText() (string, error) {
	res, err := docconv.ConvertPath("/home/breezy/Projects/ResumeParser/ResumeTransducer/UnitTests/AntonyDeepakThomas.pdf")
	if err != nil {
		return "", err
	}

	return res.Body, nil
}
