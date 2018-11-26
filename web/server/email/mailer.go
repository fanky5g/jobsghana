package email

import (
	"encoding/base64"
	"fmt"
	"reflect"
	"strings"
	"sync"

	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	gomail "gopkg.in/gomail.v2"
)

// GetMailer returns a Sender interface from passed arguments
func GetMailer(m MailConfig, f SendFunc) (Sender, error) {
	c, err := GetConfig()
	if err != nil {
		return nil, err
	}

	if c == nil {
		return nil, nil
	}

	var key string
	secret := c.Secret

	str, err := base64.StdEncoding.DecodeString(secret)

	if err != nil {
		// decoding failed, secret not base64 string
		key = secret
	}

	key = string(str)
	pswd, err := util.DecryptEnvString(key, c.SMTPPswd)
	if err != nil {
		return nil, err
	}

	c.SMTPPswd = string(pswd)
	c.Meta = m

	return &emailSender{*c, f}, nil
}

// GetConfig returns Config from application config
func GetConfig() (*Config, error) {
	c, err := config.GetRawConfig()
	if err != nil {
		return nil, err
	}

	result := &Config{}
	l := reflect.ValueOf(*result).NumField()
	for i := 0; i < l; i++ {
		v := reflect.ValueOf(*result)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()
			fieldname := t.Field(i).Name
			val := c.UString(fieldname)
			util.SetField(result, fieldname, val)
		}
	}

	return result, nil
}

// SendSingle :type SendFunc sends a single mail message
func SendSingle(addr string, a *gomail.Dialer, c MailConfig, msg []byte) error {
	m := gomail.NewMessage()
	m.SetHeader("From", c.From)

	m.SetAddressHeader("To", c.To[0].Address, c.To[0].Name)
	if c.Cc.Address != "" {
		m.SetAddressHeader("Cc", c.Cc.Address, c.Cc.Name)
	}
	m.SetHeader("Subject", c.Subject)
	m.SetBody("text/html", string(msg))

	if len(c.Attachments) > 0 {
		for _, attachment := range c.Attachments {
			m.Attach(attachment)
		}
	}

	return a.DialAndSend(m)
}

// SendMultiple :type SendFunc sends a mail to multiple receipients
func SendMultiple(addr string, a *gomail.Dialer, c MailConfig, msg []byte) error {
	m := gomail.NewMessage()
	d, err := a.Dial()

	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	var errors []string
	wg.Add(len(c.To))
	for _, to := range c.To {
		defer wg.Done()
		go func(recep Receipient) {
			m.SetHeader("From", c.From)
			m.SetAddressHeader("To", recep.Address, recep.Name)
			m.SetHeader("Subject", c.Subject)
			m.SetBody("text/html", string(msg))

			if len(c.Attachments) > 0 {
				for _, attachment := range c.Attachments {
					m.Attach(attachment)
				}
			}

			if err := gomail.Send(d, m); err != nil {
				errorstring := fmt.Sprintf("Could not send email to %q: %v", to.Address, err)
				errors = append(errors, errorstring)
			}
		}(to)

		m.Reset()
	}

	wg.Wait()
	return fmt.Errorf(strings.Join(errors, "\n"))
}
