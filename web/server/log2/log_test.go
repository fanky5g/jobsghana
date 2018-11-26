package log2

import (
	"testing"
	//"github.com/stretchr/testify/assert"
)

func TestLog(t *testing.T) {
	var log = Log
	log.Println("testing")
	t.Log("all done")
}
