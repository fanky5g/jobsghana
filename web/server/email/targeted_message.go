package email

import (
	"github.com/fanky5g/xxxinafrica/web/server/config"
	"html/template"
	"io"
	"path/filepath"
	"reflect"
)

// GenTargetedEmail generates mail template for direct message
func GenTargetedEmail(wr io.Writer, data interface{}, templateURL string) error {
	cfg, err := config.GetConfig()
	AppLogo := cfg.AppLogo

	Name := reflect.ValueOf(data).FieldByName("Name").String()
	Message := reflect.ValueOf(data).FieldByName("Message").String()

	user := struct {
		Name string
	}{Name}

	u := struct {
		User struct {
			Name string
		}
		Message string
		AppLogo string
	}{user, Message, AppLogo}

	t := template.Must(template.New("targeted_message.tmpl").ParseFiles(filepath.Clean(templateURL)))

	err = t.Execute(wr, u)
	return err
}
