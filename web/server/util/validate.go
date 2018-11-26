package util

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

// ValidatePhoneNumber checks number against basic supported phone number formats
func ValidatePhoneNumber(number string) error {
	if !strings.HasPrefix(number, "0") && !strings.HasPrefix(number, "00233") && !strings.HasPrefix(number, "+233") {
		return fmt.Errorf("expected to begin with a zero or country code")
	}

	if GuessNetwork(number) == "UNSUPPORTED" {
		return fmt.Errorf("not supported")
	}

	return nil
}

// GuessNetwork guesses the network a number is on
func GuessNetwork(phone string) string {
	if len(phone) < 3 {
		return ""
	}

	if strings.HasPrefix(phone, "00233") {
		phone = strings.TrimPrefix(phone, "00233")
	}

	if strings.HasPrefix(phone, "+233") {
		phone = strings.TrimPrefix(phone, "+233")
	}

	if utf8.RuneCountInString(phone) == 9 {
		phone = fmt.Sprintf("0%s", phone)
	}

	// after sanitations phone number should be left with 10 characters
	if utf8.RuneCountInString(phone) != 10 {
		return "UNSUPPORTED"
	}

	str := phone[1:3]
	var NetworkType string

	switch str {
	case "24":
		fallthrough
	case "54":
		fallthrough
	case "55":
		NetworkType = "MTN"
	case "27":
		fallthrough
	case "57":
		NetworkType = "TIG"
	case "20":
		fallthrough
	case "50":
		NetworkType = "VOD"
	case "26":
		fallthrough
	case "56":
		NetworkType = "AIR"
	case "28":
		NetworkType = "EXPRESSO"
	case "23":
		NetworkType = "GLO"
	default:
		NetworkType = "UNSUPPORTED"
	}
	return NetworkType
}

// FormatNumberInternational formats phone number to international format
func FormatNumberInternational(phone, country string) string {
	if len(phone) < 3 {
		return ""
	}

	if country == "GHS" {
		if strings.HasPrefix(phone, "00233") {
			phone = strings.TrimPrefix(phone, "00233")
		}

		if strings.HasPrefix(phone, "+233") {
			phone = strings.TrimPrefix(phone, "+233")
		}

		if utf8.RuneCountInString(phone) == 10 {
			phone = strings.TrimPrefix(phone, "0")
		}
		phone = fmt.Sprintf("233%s", phone)
	} else if country == "NGN" {
		if strings.HasPrefix(phone, "00234") {
			phone = strings.TrimPrefix(phone, "00234")
		}

		if strings.HasPrefix(phone, "+234") {
			phone = strings.TrimPrefix(phone, "+234")
		}

		if utf8.RuneCountInString(phone) == 10 {
			phone = strings.TrimPrefix(phone, "0")
		}

		phone = fmt.Sprintf("234%s", phone)
	}

	return phone
}
