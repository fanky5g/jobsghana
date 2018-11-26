package util

import "net/url"

// URLEncode encodes url to string
func URLEncode(str string) (string, error) {
	u, err := url.Parse(str)
	if err != nil {
		return "", err
	}
	return u.String(), nil
}
