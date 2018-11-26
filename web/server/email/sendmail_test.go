// build integration
package email

import (
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"bufio"
	"bytes"
	"github.com/stretchr/testify/assert"
	"testing"
)

// integration test
func TestEmailSend(t *testing.T) {
	parsed := &bytes.Buffer{}
	wr := bufio.NewWriter(parsed)
	key, _ := util.Gen32BitKey()
	code, _ := util.EncryptString(key, []byte("activation code"))

	data := struct {
		Name  string
		Email string
		Token string
	}{"Benjamin Appiah-Brobbey", "fanky5g@gmail.com", string(code)}

	templateURL := "../data/templates/registration.tmpl"

	err := GenActivationEmail(wr, data, templateURL)
	assert.NoError(t, err)
	assert.NotEmpty(t, parsed)

	wr.Flush()

	m := MailConfig{
		To:      []Receipient{{"Appiah-Brobbey Benjamin", "fanky5g@gmail.com"}},
		From:    "support@talentsinafrica.com",
		Subject: "Welcome to Talents in Africa",
	}

	mailer, err := GetMailer(m, SendSingle)
	assert.NoError(t, err)
	assert.Implements(t, new(Sender), mailer)
	err = mailer.Send(parsed.Bytes())
	assert.NoError(t, err)
}
