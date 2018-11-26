package seed

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestInit(t *testing.T) {
	err := Seed()
	assert.NoError(t, err)
}
