package email

import (
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"bufio"
	"bytes"
	"fmt"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

var parsed = &bytes.Buffer{}

func TestMain(m *testing.M) {
	os.Setenv("AppURL", fmt.Sprintf("%s", APPRoot))
	os.Setenv("AppName", "Talents In Africa")
	os.Setenv("AppLogo", fmt.Sprintf("%s/images/logo.png", APPRoot))
	os.Setenv("AppIcon", fmt.Sprintf("%s/favicon.ico", APPRoot))
	os.Setenv("Secret", cfg.Secret)

	code := m.Run()

	os.Unsetenv("AppURL")
	os.Unsetenv("AppName")
	os.Unsetenv("AppLogo")
	os.Unsetenv("AppIcon")
	os.Unsetenv("Secret")

	os.Exit(code)
}

func TestGenActivationEmail(t *testing.T) {
	wr := bufio.NewWriter(parsed)
	key, _ := util.Gen32BitKey()
	code, _ := util.EncryptString(key, []byte("activation code"))

	data := struct {
		Firstname string
		Lastname  string
		Email     string
		Token     string
	}{"Benjamin", "Appiah-Brobbey", "fanky5g@gmail.com", string(code)}

	templateURL := "../data/templates/registration.tmpl"
	err := GenActivationEmail(wr, data, templateURL)
	wr.Flush()
	assert.NoError(t, err)
	assert.NotEmpty(t, parsed)
}
