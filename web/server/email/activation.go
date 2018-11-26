package email

import (
	"html/template"
	"io"
	"path/filepath"
	"reflect"

	"github.com/fanky5g/xxxinafrica/web/server/config"
)

// GenActivationEmail parses activation template with passed email and token and returns a byte slice mail
func GenActivationEmail(wr io.Writer, data interface{}, templateURL string) error {
	cfg, err := config.GetConfig()
	// move these to config
	AppLogo := cfg.AppLogo
	AppURL := cfg.AppURL
	AppIcon := cfg.AppIcon
	AppName := cfg.AppName

	Name := reflect.ValueOf(data).FieldByName("Name").String()
	Email := reflect.ValueOf(data).FieldByName("Email").String()
	Code := reflect.ValueOf(data).FieldByName("Token").String()

	user := struct {
		Name  string
		Email string
	}{Name, Email}

	u := struct {
		User struct {
			Name  string
			Email string
		}
		AppLogo string
		AppURL  string
		AppIcon string
		AppName string
		Code    string
	}{user, AppLogo, AppURL, AppIcon, AppName, Code}

	t := template.Must(template.New("registration.tmpl").ParseFiles(filepath.Clean(templateURL)))

	err = t.Execute(wr, u)
	return err
}
