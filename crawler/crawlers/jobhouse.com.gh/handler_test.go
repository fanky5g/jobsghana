package jobhouse

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestCrawl(t *testing.T) {
	out, err := DoCrawl()
	assert.NoError(t, err)
	t.Log(out)
}
