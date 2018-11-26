package queue

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

// WorkerQueue represents a clannel along which workers are queued to pick up job requests
var WorkerQueue chan chan types.WorkRequest

// WorkQueue holds jobs that needs to be processed
var WorkQueue = make(chan types.WorkRequest, 100)

// StartDispatcher starts the application dispatcher that enqueues workers and job requests
func StartDispatcher(nworkers int) {
	WorkerQueue = make(chan chan types.WorkRequest, nworkers)

	for i := 0; i < nworkers; i++ {
		worker := NewWorker(i+1, WorkerQueue)
		worker.Start()
	}

	go func() {
		for {
			select {
			case work := <-WorkQueue:
				go func() {
					worker := <-WorkerQueue
					worker <- work
				}()
			}
		}
	}()
}
