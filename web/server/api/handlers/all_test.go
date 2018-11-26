// +build unit
// +build !integration

package handlers

import (
	"os"
	"testing"

	"github.com/olebedev/config"
)

var (
	handlers *Handlers
)

const testDB = "talentsinafrica"

var confString = `
TemplateDir: ../../data/templates
`

func TestMain(m *testing.M) {
	// Parse config yaml string from ./conf.go
	conf, err := config.ParseYaml(confString)
	if err != nil {
		logger.Fatal(err)
		os.Exit(1)
	}

	os.Setenv("AppURL", APPRoot)
	os.Setenv("AppName", "Talents In Africa")
	os.Setenv("AppLogo", cfg.AppLogo)
	os.Setenv("AppIcon", cfg.AppIcon)
	os.Setenv("Secret", cfg.Secret)

	handlers = &Handlers{conf}

	code := m.Run()

	os.Unsetenv("AppURL")
	os.Unsetenv("AppName")
	os.Unsetenv("AppLogo")
	os.Unsetenv("AppIcon")
	os.Unsetenv("Secret")

	os.Exit(code)
}
