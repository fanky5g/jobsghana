package util

// import (
// "github.com/fanky5g/xxxinafrica/web/server/types"
// "github.com/fanky5g/xxxinafrica/web/server/util"
// 	"github.com/stretchr/testify/assert"
// 	"testing"
// )

// var (
// 	signingKey   []byte
// 	signedString []byte
// 	testString   = "$$_Fankygold2010_$$"
// )

// func TestGen32BitKey(t *testing.T) {
// 	key, err := Gen32BitKey()
// 	assert.NoError(t, err)
// 	assert.NotNil(t, key)
// 	signingKey = key
// }

// func TestEncryptString(t *testing.T) {
// 	hash, err := EncryptString(signingKey, []byte(testString))
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, hash)
// 	signedString = hash
// }

// func TestDecryptString(t *testing.T) {
// 	d, err := DecryptString(signingKey, signedString)
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, d)
// 	assert.Equal(t, string(d), testString)
// }

// func TestDecodeMap(t testing.T) {
// 	mapToTest := map[string]interface{}{
// 		"ID":        0,
// 		"key":       "ebd31ea6-1584-47e0-82ec-9c30def02fe1.jpg",
// 		"url":       "https://s3.amazonaws.com/talentsinafrica_store/ebd31ea6-1584-47e0-82ec-9c30def02fe1.jpg",
// 		"mime":      "image/jpeg",
// 		"size":      988102,
// 		"width":     4533,
// 		"bucket":    "talentsinafrica_store",
// 		"height":    917,
// 		"authorID":  0,
// 		"fileName":  "ebd31ea6-1584-47e0-82ec-9c30def02fe1",
// 		"CreatedAt": "0001-01-01T00:00:00Z",
// 		"DeletedAt": nil,
// 		"UpdatedAt": "0001-01-01T00:00:00Z",
// 		"imageType": "JPEG",
// 	}

// 	var file types.FileMetadata
// 	err := FillStruct(file, mapToTest)
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, file)
// }
