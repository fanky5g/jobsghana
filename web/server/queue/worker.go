package queue

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

// NewWorker creates, and returns a new Worker object.
func NewWorker(id int, workerQueue chan chan types.WorkRequest) types.Worker {
	worker := types.Worker{
		ID:          id,
		Work:        make(chan types.WorkRequest),
		WorkerQueue: workerQueue,
		QuitChan:    make(chan bool),
	}

	return worker
}
