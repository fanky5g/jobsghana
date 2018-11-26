package types

import "github.com/fanky5g/xxxinafrica/web/server/log2"

var log = log2.Log

// WorkRequest represents work request to queue
type WorkRequest struct {
	Work    func(interface{}) error
	Payload interface{}
}

// Worker is a single node in the work queue that processes jobs
type Worker struct {
	ID          int
	Work        chan WorkRequest
	WorkerQueue chan chan WorkRequest
	QuitChan    chan bool
}

// Start "starts" the worker by starting a goroutine, that is
// an infinite "for-select" loop.
func (w *Worker) Start() {
	go func() {
		for {
			w.WorkerQueue <- w.Work

			select {
			case work := <-w.Work:
				// Receive a work request.
				err := work.Work(work.Payload)
				if err != nil {
					log.Println(err)
				}
			case <-w.QuitChan:
				return
			}
		}
	}()
}

// Stop tells the worker to stop listening for work requests.
// Note that the worker will only stop *after* it has finished its work.
func (w *Worker) Stop() {
	go func() {
		w.QuitChan <- true
	}()
}
