// +build !unit
// +build integration

package handlers

// import (
// 	"archive/zip"
// 	"github.com/fanky5g/xxxinafrica/web/server/types"
// 	"github.com/fanky5g/xxxinafrica/web/server/upload"
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"github.com/labstack/echo"
// 	"github.com/stretchr/testify/assert"
// 	"io"
// 	"io/ioutil"
// 	"log"
// 	"net/http"
// 	"net/http/httptest"
// 	"os"
// 	"path/filepath"
// 	"sync"
// 	"testing"
// )

// var (
// 	fp1      = "preview.png"
// 	fp2      = "pp.jpg"
// 	client   *upload.S3Agent
// 	uploaded []types.FileMetadata
// )

// func upfiles(p []string) (outArr []types.FileMetadata, err error) {
// 	if len(p) == 0 {
// 		return outArr, fmt.Errorf("No paths specified")
// 	}

// 	for _, entry := range p {
// 		fp, err := filepath.Abs(fmt.Sprintf("../data/static/testdata/%s", entry))

// 		if err != nil {
// 			return outArr, err
// 		}

// 		file, err := os.Open(fp)
// 		if err != nil {
// 			return outArr, err
// 		}

// 		defer file.Close()

// 		out, err := client.Upload(file, fp)
// 		if err != nil {
// 			return outArr, err
// 		}

// 		outArr = append(outArr, out)
// 	}

// 	return outArr, nil
// }

// func setup() []types.FileMetadata {
// 	var awsCfg *upload.AWSConfig

// 	awsCfg, err := upload.GetConfig()

// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if awsCfg.AWSAccessKeyID == "" {
// 		log.Fatal("Expected AWSAccessKey to not equal empty string")
// 	}

// 	client, err = upload.CreateClient(awsCfg, awsCfg.Bucket, "files")
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	uploaded, err := upfiles([]string{fp1, fp2})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	return uploaded
// }

// func cleanup(files []types.FileMetadata) error {
// 	for _, f := range files {
// 		deleted, err := client.DeleteFile(client.BucketName, f.Key)
// 		if err != nil {
// 			return err
// 		}

// 		if deleted != true {
// 			return fmt.Errorf("Expected deleted to equal true but got %d", deleted)
// 		}
// 	}
// 	return nil
// }

// func init() {
// 	uploaded = setup()
// }

// func TestDownloadHandlerMultiple(t *testing.T) {
// 	e := echo.New()

// 	w := &bytes.Buffer{}
// 	r := json.NewEncoder(w)

// 	err := r.Encode(uploaded)

// 	if err != nil {
// 		t.Error(err)
// 	}

// 	req, err := http.NewRequest(echo.POST, "/download", w)
// 	req.Header.Set("Content-Type", "application/json")
// 	res := httptest.NewRecorder()

// 	c := e.NewContext(req, res)

// 	if assert.NoError(t, handlers.DownloadHandler(client)(c)) {
// 		assert.Equal(t, http.StatusOK, res.Code)
// 		assert.Equal(t, "application/zip", res.Header().Get("Content-Type"))

// 		file, err := ioutil.TempFile(os.TempDir(), "download")

// 		if err != nil {
// 			t.Fatal(err)
// 		}

// 		newname := fmt.Sprintf("%s%s", file.Name(), ".zip")
// 		err = os.Rename(file.Name(), newname)
// 		if err != nil {
// 			t.Fatal(err)
// 		}

// 		file.Close()

// 		defer os.Remove(newname)
// 		resp := res.Result()
// 		defer resp.Body.Close()

// 		var wg sync.WaitGroup
// 		wg.Add(1)

// 		go func() {
// 			defer wg.Done()
// 			f, err := os.OpenFile(newname, os.O_APPEND|os.O_WRONLY, os.ModeAppend)

// 			if err != nil {
// 				t.Fatal(err)
// 			}

// 			_, err = io.Copy(f, resp.Body)
// 			resp.Header.Get("Content-Length")

// 			if err != nil {
// 				t.Fatal(err)
// 			}
// 		}()

// 		wg.Wait()

// 		r, err := zip.OpenReader(newname)

// 		if err != nil {
// 			t.Fatal(err)
// 		}

// 		defer func() {
// 			if err := r.Close(); err != nil {
// 				t.Fatal(err)
// 			}
// 		}()

// 		// copied from http://stackoverflow.com/questions/20357223/easy-way-to-unzip-file-with-golang
// 		extractAndWriteFile := func(f *zip.File) (int64, error) {
// 			var written int64

// 			rc, err := f.Open()
// 			if err != nil {
// 				return written, err
// 			}

// 			defer func() {
// 				if err := rc.Close(); err != nil {
// 					panic(err)
// 				}
// 			}()

// 			path := filepath.Join(os.TempDir(), f.Name)

// 			if f.FileInfo().IsDir() {
// 				os.MkdirAll(path, f.Mode())
// 			} else {
// 				os.MkdirAll(filepath.Dir(path), f.Mode())
// 				f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
// 				if err != nil {
// 					return written, err
// 				}
// 				defer func() {
// 					if err := f.Close(); err != nil {
// 						panic(err)
// 					}
// 				}()

// 				written, err = io.Copy(f, rc)

// 				if err != nil {
// 					panic(err)
// 				}
// 			}
// 			return written, nil
// 		}

// 		for _, f := range r.File {
// 			filesize, err := extractAndWriteFile(f)
// 			if err != nil {
// 				t.Error(err)
// 			}

// 			filename := f.FileInfo().Name()
// 			var origSize int64
// 			for _, v := range uploaded {
// 				if filename == v.Key {
// 					origSize = int64(v.FileSize)
// 				}
// 			}

// 			if origSize != filesize {
// 				t.Errorf("Expected written filesize to equal %d but got %d", origSize, filesize)
// 			}

// 			err = os.Remove(fmt.Sprintf("%s/%s", os.TempDir(), filename))
// 			if err != nil {
// 				t.Fatal(err)
// 			}
// 		}
// 	}
// }

// func TestDownloadHandlerSingle(t *testing.T) {
// 	e := echo.New()

// 	w := &bytes.Buffer{}
// 	r := json.NewEncoder(w)

// 	err := r.Encode(uploaded[:1])

// 	if err != nil {
// 		t.Error(err)
// 	}

// 	req, err := http.NewRequest(echo.POST, "/download", w)
// 	req.Header.Set("Content-Type", "application/json")
// 	res := httptest.NewRecorder()

// 	c := e.NewContext(req, res)

// 	if assert.NoError(t, handlers.DownloadHandler(client)(c)) {
// 		assert.Equal(t, http.StatusFound, res.Code)
// 		assert.NotEmpty(t, res.Header().Get("Location"))
// 	}
// 	cleanup(uploaded)
// }
