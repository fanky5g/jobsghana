package middleware

import (
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"bytes"
	"fmt"
	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"
)

func TestUploadMiddleware(t *testing.T) {
	filekey := "preview.png"
	filekey2 := "pp.jpg"
	fp, err := filepath.Abs(fmt.Sprintf("../data/static/testdata/%s", filekey))
	fp2, err := filepath.Abs(fmt.Sprintf("../data/static/testdata/%s", filekey2))

	file, err := os.Open(fp)

	if err != nil {
		t.Fatal(err)
	}

	var wg sync.WaitGroup
	wg.Add(2)

	defer file.Close()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	go func() {
		defer wg.Done()
		part, err := writer.CreateFormFile("file1", filepath.Base(fp))
		if err != nil {
			t.Error(err)
		}

		_, err = io.Copy(part, file)

		if err != nil {
			t.Error(err)
		}
	}()

	file2, err := os.Open(fp2)
	if err != nil {
		t.Fatal(err)
	}

	defer file2.Close()

	go func() {
		defer wg.Done()
		part, err := writer.CreateFormFile("file2", filepath.Base(fp2))
		if err != nil {
			t.Error(err)
		}

		_, err = io.Copy(part, file2)

		if err != nil {
			t.Error(err)
		}
	}()

	wg.Wait()
	writer.Close()

	res := httptest.NewRecorder()
	req := httptest.NewRequest(echo.PUT, "/", body)

	e := echo.New()

	req.Header.Set("Content-Type", writer.FormDataContentType())

	c := e.NewContext(req, res)

	var awsCfg *upload.AWSConfig

	awsCfg, err = upload.GetConfig("../../.env")

	if err != nil {
		t.Error(err)
	}

	if awsCfg.AWSAccessKeyID == "" {
		t.Error("Expected AWSAccessKey to not equal empty string")
	}

	client, err := upload.CreateClient(awsCfg, awsCfg.Bucket, session, "files")

	assert.NoError(t, err)

	h := UploadMiddleware(client)(func(c echo.Context) error {
		return c.String(http.StatusOK, "test")
	})

	assert.NoError(t, h(c))
}
