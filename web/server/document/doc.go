package document

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"fmt"
	"github.com/aymerick/raymond"
	"github.com/fatih/structs"
	"github.com/jaytaylor/html2text"
	"github.com/jung-kurt/gofpdf"
	"io/ioutil"
)

const (
	fontPtSize = 12.0
	wd         = 200.0
)

func getTemplate() (string, error) {
	temp, err := ioutil.ReadFile("server/document/resume.hbs")
	if err != nil {
		return "", err
	}

	return string(temp), nil
}

// RenderResume renders users resume into a string format
func RenderResume(resume types.JobProfile) (string, error) {
	temp, err := getTemplate()
	if err != nil {
		return "", err
	}

	ctx := map[string]interface{}{
		"resume": structs.Map(resume),
	}

	result, err := raymond.Render(temp, ctx)
	if err != nil {
		return "", err
	}

	text, err := html2text.FromString(result, html2text.Options{PrettyTables: true})
	if err != nil {
		return "", err
	}

	return text, nil
}

// GeneratePDFFromString generates pdf from provided string
func GeneratePDFFromString(text string) (string, error) {
	b := []byte(text)

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetFont("Times", "", fontPtSize)
	_, lineHt := pdf.GetFontSize()
	pdf.AddPage()
	pdf.SetMargins(10, 10, 10)
	lines := pdf.SplitLines(b, wd)
	ht := float64(len(lines)) * lineHt
	y := (297.0 - ht) / 2.0
	pdf.SetDrawColor(128, 128, 128)
	pdf.SetFillColor(255, 255, 255)
	x := (210.0 - (wd + 40.0)) / 2.0
	pdf.Rect(x, y-20.0, wd+40.0, ht+40.0, "FD")
	// pdf.SetY(y)
	for _, line := range lines {
		pdf.CellFormat(190.0, lineHt, string(line), "", 1, "C", false, 0, "")
	}
	fileStr := fmt.Sprintf("/tmp/%s.pdf", util.GenUniqueKey())
	err := pdf.OutputFileAndClose(fileStr)
	if err != nil {
		return "", err
	}

	return fileStr, nil
}

// GenerateAccountResume generates resume for user
func GenerateAccountResume(accountID uint) (string, error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	var user types.User
	err := db.First(&user, accountID).Error
	if err != nil {
		return "", err
	}

	resume, err := RenderResume(user.Profile)
	if err != nil {
		return "", err
	}

	location, err := GeneratePDFFromString(resume)
	if err != nil {
		return "", err
	}

	return location, nil
}
