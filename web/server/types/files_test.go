package types

import (
	// "github.com/fanky5g/xxxinafrica/web/server/util"
	// "fmt"
	"github.com/stretchr/testify/assert"
	// "reflect"
	// "strings"
	"testing"
)

// var filename = "file.txt"

// func TestGetFileExt(t *testing.T) {
// 	ext := GetFileExt(filename)

// 	if ext == "" {
// 		t.Error("Expected extension, got empty string")
// 	}

// 	if ext != ".txt" {
// 		t.Errorf("Expected extension to be .txt but got %s", ext)
// 	}
// }

// func TestGetFileName(t *testing.T) {
// 	name := GetFileName(filename)

// 	if name == "" {
// 		t.Error("Expected filename, got empty string")
// 	}

// 	if name != "file" {
// 		t.Errorf("Expected extension to be file but got %s", name)
// 	}
// }

// func TestGetMimeType(t *testing.T) {
// 	textMime := "text/plain; charset=utf-8"
// 	m := GetMimeType(filename)

// 	if m == "" {
// 		t.Error("Expected mimetype got empty string")
// 	}

// 	if m != textMime {
// 		t.Errorf("Expected %s but got %s", textMime, m)
// 	}
// }

// func TestFormatFile(t *testing.T) {
// 	key := "preview.txt"
// 	bucket := "mybucket"
// 	in := &File{
// 		Key:      key,
// 		Bucket:   bucket,
// 		Location: fmt.Sprintf("http://%s.s3.amazonaws.com/%s", bucket, key),
// 		Size:     uint64(164000),
// 	}

// 	expected := Metadata{
// 		FileName: GetFileName(key),
// 		Key:      key,
// 		FileSize: in.Size,
// 		MimeType: GetMimeType(key),
// 		Bucket:   bucket,
// 		URL:      in.Location,
// 		Kind:     GetKind(key),
// 	}

// 	out := FormatFile(in)

// 	if out.Key != in.Key {
// 		t.Errorf("Expected formated key to equal %s but got %s", out.Key)
// 	}

// 	if out != expected {
// 		t.Error("Malformed formatted file")
// 	}
// }

// func TestDecodeMap(t *testing.T) {
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

// 	assert.NotEmpty(t, mapToTest)
// 	// assert.Equal(t, "role", extractGormColumnNameFromString("column:role;not null"))
// 	var file FileMetadata
// 	err := decodeFileFromSQLJSON(mapToTest, &file)
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, file)
// 	t.Log(file)
// }
