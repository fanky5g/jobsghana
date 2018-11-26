package types

import (
	"fmt"
	"strconv"
	"time"
)

// Timestamp holds conversion utilities wrapped around time.Time
type Timestamp time.Time

// MarshalJSON converts time.Time to a byte array we can store
func (t *Timestamp) MarshalJSON() ([]byte, error) {
	ts := time.Time(*t).Unix()
	stamp := fmt.Sprint(ts)

	return []byte(stamp), nil
}

// UnmarshalJSON deserializes a time byte array
func (t *Timestamp) UnmarshalJSON(b []byte) error {
	ts, err := strconv.Atoi(string(b))
	if err != nil {
		return err
	}

	*t = Timestamp(time.Unix(int64(ts), 0))

	return nil
}

// IsPast checks if time is in past
func (t *Timestamp) IsPast() bool {
	ts := time.Time(*t)
	return !ts.After(time.Now())
}

// String stringifies a time object
func (t *Timestamp) String() string {
	return time.Time(*t).String()
}
