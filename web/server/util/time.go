package util

import (
	"github.com/araddon/dateparse"
	"time"
)

// ParseTime parses a time string to time.Time
func ParseTime(t string) (time.Time, error) {
	layout := "2006-01-02 15:04:05 ZO700"
	return time.Parse(layout, t)
}

// ParseTimeString parses time strings in different formats
func ParseTimeString(t string) (time.Time, error) {
	return dateparse.ParseLocal(t)
}
