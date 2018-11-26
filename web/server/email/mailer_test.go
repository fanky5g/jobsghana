package email

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

var mailer Sender

func TestGetConfig(t *testing.T) {
	c, err := GetConfig()
	assert.NoError(t, err)
	assert.IsType(t, new(Config), c)
}

func TestGetMailer(t *testing.T) {
	m := MailConfig{
		To:      []Receipient{{"Appiah-Brobbey Benjamin", "fanky5g@gmail.com"}},
		From:    "support@talentsinafrica.com",
		Subject: "Test email",
	}

	i, err := GetMailer(m, SendSingle)
	assert.NoError(t, err)
	mailer = i
	assert.Implements(t, new(Sender), mailer)
}
