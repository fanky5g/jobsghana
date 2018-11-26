package email

// import (
// 	gomail "gopkg.in/gomail.v2"
// 	"testing"
// )

// func mockSend(errToReturn error) (func(string, *gomail.Dialer, MailConfig, []byte) error, *emailRecorder) {
// 	r := new(emailRecorder)
// 	return func(addr string, a *gomail.Dialer, c MailConfig, msg []byte) error {
// 		*r = emailRecorder{addr, a, c.From, c.To, msg}
// 		return errToReturn
// 	}, r
// }

// type emailRecorder struct {
// 	addr   string
// 	dialer *gomail.Dialer
// 	from   string
// 	to     []Receipient
// 	msg    []byte
// }

// func TestEmail_SendSuccessful(t *testing.T) {
// 	f, r := mockSend(nil)
// 	c := MailConfig{To: []Receipient{{Name: "Myself", Address: "me@example.com"}}}
// 	sender := &emailSender{send: f, conf: Config{Meta: c}}
// 	body := "Hello World"
// 	err := sender.Send([]byte(body))

// 	if err != nil {
// 		t.Errorf("unexpected error: %s", err)
// 	}
// 	if string(r.msg) != body {
// 		t.Errorf("wrong message body.\n\nexpected: %\n got: %s", body, r.msg)
// 	}
// }
