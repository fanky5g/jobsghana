package blog

import (
	"errors"
)

var (
	// ErrPostNotFound holds error for notfoundpost
	ErrPostNotFound = errors.New("post not found")
	// ErrResourceRemoveFailure holds error for when resource cleaning fails
	ErrResourceRemoveFailure = errors.New("one or more resources couldn't be cleaned")
	// EmptyHeaderIndex integer value representation
	EmptyHeaderIndex = -1
)
