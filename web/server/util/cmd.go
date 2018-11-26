package util

import (
	"os/exec"
	"sync"

	"github.com/fanky5g/xxxinafrica/web/server/log"
)

// ExecuteCommand executes a command
func ExecuteCommand(cmd string, wg *sync.WaitGroup) (string, error) {
	out, err := exec.Command("sh", "-c", cmd).Output()

	if err != nil {
		log.Debug(err)
	}

	defer wg.Done()
	return string(out), err
}
