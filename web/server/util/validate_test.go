package util

// import (
// 	"github.com/stretchr/testify/assert"
// 	"testing"
// )

// func TestValidateNumber(t *testing.T) {
// 	assert.NoError(t, ValidatePhoneNumber("0545385122"))
// 	assert.NoError(t, ValidatePhoneNumber("0269339921"))
// 	assert.NoError(t, ValidatePhoneNumber("+233545902915"))
// 	assert.NoError(t, ValidatePhoneNumber("00233264039222"))
// 	assert.Error(t, ValidatePhoneNumber("0904332211"))
// 	assert.Error(t, ValidatePhoneNumber("024430293"))
// 	assert.Error(t, ValidatePhoneNumber("50"))
// 	assert.Error(t, ValidatePhoneNumber("0.1"))
// }

// func TestRoundFloat(t *testing.T) {
// 	assert.Equal(t, RoundFloat(0.0025, .1, 2), 0.01)
// }

// func TestParseTime(t *testing.T) {
// 	res, err := ParseTimeStringWithDefault("3/2016")
// 	assert.NoError(t, err)
// 	t.Log(res)
// }
