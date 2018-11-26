package email

import (
	"fmt"
	"strconv"
	"strings"

	gomail "gopkg.in/gomail.v2"
)

type emailSender struct {
	conf Config
	send func(string, *gomail.Dialer, MailConfig, []byte) error
}

func (e *emailSender) Send(body []byte) error {
	port, err := strconv.Atoi(e.conf.SMTPPort)
	if err != nil {
		return err
	}

	//for some weird reason, we receiving blank space as part of password string
	e.conf.SMTPPswd = strings.TrimSpace(e.conf.SMTPPswd)

	addr := fmt.Sprintf("%s:%d", e.conf.SMTPHost, e.conf.SMTPPort)
	dialer := gomail.NewDialer(e.conf.SMTPHost, port, e.conf.SMTPUser, e.conf.SMTPPswd)
	return e.send(addr, dialer, e.conf.Meta, body)
}
