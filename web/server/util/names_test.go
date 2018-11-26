package util

// import (
// 	"github.com/fanky5g/xxxinafrica/web/server/files"
// 	"strings"
// 	"testing"
// )

// func TestTempName(t *testing.T) {
// 	prefix := "myTempName"
// 	fileName := TempName("myTempName", 8)

// 	if fileName == "" {
// 		t.Error("Tempname empty")
// 	}

// 	if !strings.Contains(fileName, prefix) {
// 		t.Error("Tempname does not include prefix")
// 	}
// }

// func TestGenUniqueKey(t *testing.T) {
// 	filename := "preview.png"

// 	unique := GenUniqueKey()
// 	if unique == "" {
// 		t.Error("GenUniqueKey returned empty string")
// 	}

// 	if !strings.Contains(unique, files.GetFileExt(filename)) {
// 		t.Errorf("Expected unique key to have extension %s but got", files.GetFileExt(unique))
// 	}
// }
