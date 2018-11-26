package handlers

import (
	// "bytes"
	"encoding/json"
	// "fmt"
	// "github.com/fanky5g/xxxinafrica/web/server/database"
	// "github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
	// "io"
	"io/ioutil"
	// "mime/multipart"
	"net/http"
	"net/http/httptest"
	// "os"
	// "path/filepath"
	// "sync"
	"testing"
)

// func TestParseResume(t *testing.T) {
// 	filekey := "AntonyDeepakThomas.pdf"
// 	fp, err := filepath.Abs(fmt.Sprintf("/home/breezy/Projects/ChineseResumeParser/ResumeTransducer/UnitTests/%s", filekey))

// 	file, err := os.Open(fp)

// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	var wg sync.WaitGroup
// 	wg.Add(1)

// 	defer file.Close()
// 	body := &bytes.Buffer{}
// 	writer := multipart.NewWriter(body)

// 	go func() {
// 		defer wg.Done()
// 		part, err := writer.CreateFormFile("resume", filepath.Base(fp))
// 		if err != nil {
// 			t.Error(err)
// 		}

// 		_, err = io.Copy(part, file)

// 		if err != nil {
// 			t.Error(err)
// 		}
// 	}()

// 	wg.Wait()
// 	writer.Close()

// 	res := httptest.NewRecorder()
// 	req := httptest.NewRequest(echo.PUT, "/", body)

// 	e := echo.New()

// 	req.Header.Set("Content-Type", writer.FormDataContentType())

// 	c := e.NewContext(req, res)

// 	handler := &Handlers{}

// 	h := func(c echo.Context) error {
// 		return handler.ParseResume(c)
// 	}

// 	if assert.NoError(t, h(c)) {
// 		assert.Equal(t, http.StatusOK, res.Code)
// 		// look at response later
// 		resp := res.Result()
// 		defer resp.Body.Close()

// 		b, err := ioutil.ReadAll(resp.Body)
// 		assert.NoError(t, err)

// 		var responseBody returnMsg
// 		err = json.Unmarshal(b, &responseBody)
// 		assert.NoError(t, err)

// 		resume := responseBody.Body.(map[string]interface{})
// 		assert.NotNil(t, resume["resume"])
// 	}
// }

func TestSearchResume(t *testing.T) {
	res := httptest.NewRecorder()
	req := httptest.NewRequest(echo.POST, "/?query=software+engineer&location=greater+accra", nil)

	e := echo.New()

	c := e.NewContext(req, res)

	handler := &Handlers{}

	h := func(c echo.Context) error {
		return handler.FindResume(c)
	}

	if assert.NoError(t, h(c)) {
		assert.Equal(t, http.StatusOK, res.Code)
		// look at response later
		resp := res.Result()
		defer resp.Body.Close()

		b, err := ioutil.ReadAll(resp.Body)
		assert.NoError(t, err)

		type responseBody struct {
			Elapsed  string                   `json:"elapsed"`
			Profiles []map[string]interface{} `json:"profiles"`
		}

		var response responseBody

		err = json.Unmarshal(b, &response)
		assert.NoError(t, err)
		// assert.NotNil(t, resume["resume"])
		t.Log(response)
	}

	// resumes, err := getLastIndexedResumes(5)
	// assert.NoError(t, err)
	// t.Log(resumes)
}

// func getLastIndexedResumes(num int) ([]map[string]interface{}, error) {
// 	var resumes []map[string]interface{}

// 	index, err := database.GetBleveUserIndex()
// 	if err != nil {
// 		return resumes, err
// 	}

// 	fields := []string{"id", "jobSector", "jobTitle", "location", "pref_loc", "level", "salaryExpectation", "jobType"}
// 	numDocs := num

// 	resumeResults, err := database.GetLastNDocs(index, numDocs, fields)
// 	if err != nil {
// 		return resumes, err
// 	}

// 	for _, v := range resumeResults.Hits {
// 		resumes = append(resumes, map[string]interface{}{
// 			"id":                int(v.Fields["id"].(float64)),
// 			"jobSector":         v.Fields["jobSector"].(string),
// 			"jobTitle":          v.Fields["jobTitle"].(string),
// 			"location":          v.Fields["location"].(string),
// 			"pref_loc":          v.Fields["pref_loc"].(string),
// 			"level":             v.Fields["level"].(string),
// 			"salaryExpectation": v.Fields["salaryExpectation"].(string),
// 			"jobType":           v.Fields["jobType"].(string),
// 		})
// 	}

// 	return resumes, nil
// }
