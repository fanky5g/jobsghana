package handlers

import (
	"net/http"

	"github.com/fanky5g/xxxinafrica/web/server/indexer"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/labstack/echo"
)

// IndexJobs receives a job array from lambda crawler and indexes them locally
func (h *Handlers) IndexJobs(c echo.Context) error {
	type request struct {
		Jobs []types.Job `json:"jobs"`
	}

	var input request
	err := c.Bind(&input)

	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	jobs := input.Jobs
	err = indexer.IndexJobs(jobs)

	if err != nil {
		logger.Println(err)
		c.Error(err)
		return err
	}

	return c.NoContent(http.StatusOK)
}
