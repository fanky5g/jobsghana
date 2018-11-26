package document

import (
	// "github.com/fanky5g/xxxinafrica/web/server/auth"
	// "github.com/fanky5g/xxxinafrica/web/server/database"
	// "github.com/fanky5g/xxxinafrica/web/server/config"
	// "encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
)

// func TestExtract(t *testing.T) {
// 	text, err := ExtractText()
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, text)
// 	t.Log(text)
// }

func TestParseResume(t *testing.T) {
	resume, err := ParseResume("0664dd70-280f-416d-8008-88f987f59ede.pdf")
	assert.NoError(t, err)
	assert.NotNil(t, resume)
	assert.NotEmpty(t, resume)
	t.Log(resume)
}

// func TestCleanJSON(t *testing.T) {
// 	stringtotest := "this is a regular string Page566 and"
// 	str := cleanString(stringtotest)
// 	assert.Equal(t, "this is a regular string and", string(str))
// }

// func TestGeneratePDFFromString(t *testing.T) {

// 	// temp, err := getTemplate()
// 	// assert.NoError(t, err)
// 	// assert.NotEmpty(t, temp)

// 	// db := database.GetMySQLInstance()
// 	// defer db.Close()

// 	// var user auth.User
// 	// err = db.First(&user, 3).Error
// 	// assert.NoError(t, err)

// 	// resume, err := RenderResume(user.Profile)
// 	// assert.NoError(t, err)
// 	// assert.NotEmpty(t, resume)

// 	// location, err := GeneratePDFFromString(resume)
// 	// assert.NoError(t, err)
// 	// assert.NotEmpty(t, location)

// 	location, err := GenerateAccountResume(3)
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, location)
// 	t.Log(location)
// }
