package util

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/twinj/uuid"
	"io"
	"math"
	mathrand "math/rand"
	"net"
	"net/http"
	"time"
)

// GenUniqueKey returns a uuid for efficient ids
func GenUniqueKey() string {
	u := uuid.NewV4()
	return u.String()
}

// CreateHMACFromStruct creates sha256 hmac string from struct
// @todo:ensure body is struct
func CreateHMACFromStruct(body interface{}, secret string) (string, error) {
	key := []byte(secret)
	h := hmac.New(sha256.New, key)

	// encode body
	b, err := json.Marshal(body)
	if err != nil {
		return "", err
	}

	written, err := h.Write(b)
	if err != nil {
		return "", err
	}

	if written != len(b) {
		return "", fmt.Errorf("written in part")
	}

	return hex.EncodeToString(h.Sum(nil)), nil
}

// GetCurrentTimestamp formats current time in "2006-01-02 15:04:05 Z0700" layout
func GetCurrentTimestamp() string {
	t := time.Now()
	return t.Format("2006-01-02 15:04:05 ZO700")
}

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

// GenerateVerificationCode generates 6 digit verification string for mobile
func GenerateVerificationCode() string {
	vals := [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
	b := make([]byte, 6)
	n, err := io.ReadAtLeast(rand.Reader, b, 6)
	if n != 6 {
		panic(err)
	}
	for i := 0; i < len(b); i++ {
		b[i] = vals[int(b[i])%len(vals)]
	}
	return string(b)
}

// PickRandomSliceString returns random element from a slice of strings
func PickRandomSliceString(slice []string) string {
	if len(slice) == 0 {
		return ""
	}

	mathrand.Seed(time.Now().Unix())
	return slice[mathrand.Intn(len(slice))]
}

// RoundFloat rounds floats to the nearest places provided. roundOn is a value to round by example .5
func RoundFloat(val float64, roundOn float64, places int) (newVal float64) {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * val
	_, div := math.Modf(digit)
	if div >= roundOn {
		round = math.Ceil(digit)
	} else {
		round = math.Floor(digit)
	}
	newVal = round / pow
	return
}
