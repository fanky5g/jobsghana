package util

import (
	// "encoding/base64"
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
	"time"
)

// var secret = "Z29sZDU5"
// var pswd = `U2FsdGVkX1/bI33TCioeiDvakYN6TcUP96JLcE2Et7zUSj9ZS0ioute5bapAFrxM`

// func TestDecryptEnvString(t *testing.T) {
// 	key, _ := base64.StdEncoding.DecodeString(secret)
// 	_, err := DecryptEnvString(string(key), pswd)
// 	assert.NoError(t, err)
// 	// omitted line
// }

func TestParseTime(t *testing.T) {
	// cannot parse Thu Oct 19 2017 06:36:43 GMT+0000 (GMT) as Mon _2....
	times, err := time.Parse("Mon Jan _2 15:04:05 2006", "Thu Oct 19 2017 06:36:43 GMT+0000 (GMT)")
	if assert.Error(t, err) {
		times, err = time.Parse("Mon Jan _2 2006 15:04:05 GMT+0000 (GMT)", "Thu Oct 19 2017 06:36:43 GMT+0000 (GMT)")
		assert.NoError(t, err)
	}
	t.Log(times)
}

func TestStringJoin(t *testing.T) {
	arr := []string{"interview-tips", "mice"}
	strings.Join(strings.Split(strings.Repeat("?", len(arr)), ""), ",")
	println()
}
