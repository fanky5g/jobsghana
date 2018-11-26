package email

import (
	"io"

	"github.com/fanky5g/xxxinafrica/web/server/config"
	gomail "gopkg.in/gomail.v2"
)

// Sender interface provides Send function interface requirement
type Sender interface {
	Send(body []byte) error
}

var (
	cfg, _ = config.GetConfig()
	// APPRoot defines application url
	APPRoot = cfg.AppURL
)

// SendFunc does actual sending of email, use your own implementation
type SendFunc func(addr string, a *gomail.Dialer, c MailConfig, msg []byte) error

// TemplateFunc processes template passed with data interface argument
type TemplateFunc func(path string, data interface{}, w io.Writer) error

// Config holds configuration variables for email sending function
type Config struct {
	SMTPUser string
	SMTPPswd string
	SMTPHost string
	SMTPPort string
	SMTPAddr string
	Secret   string
	Meta     MailConfig
}

// Receipient holds fields for email receipient's name and email address
type Receipient struct {
	Name    string
	Address string
}

// MailConfig contains fields for mail subject and receipients
type MailConfig struct {
	From        string
	To          []Receipient
	Cc          Receipient
	Subject     string
	Attachments []string
}
