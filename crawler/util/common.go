package util

import (
	"net"
	"net/http"
	"time"
)

// GetClient returns an http client for transactions
func GetClient() *http.Client {
	var t = &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		Dial: (&net.Dialer{
			Timeout:   60 * time.Second,
			KeepAlive: 30 * time.Second,
		}).Dial,
		TLSHandshakeTimeout: 30 * time.Second,
	}

	var client = &http.Client{
		Transport: t,
	}

	return client
}
