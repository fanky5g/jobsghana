package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/labstack/echo"
)

var (
	errServer = errors.New("Server Error")
)

// SearchJob searches jobs based on user query sent
func (h *Handlers) SearchJob(c echo.Context) error {
	start := time.Now()
	query := c.QueryParam("query")
	region := c.QueryParam("region")
	var wg sync.WaitGroup

	job := make(chan types.Job)

	var foundJobs []types.Job

	wg.Add(1)
	go func(q string, j chan<- types.Job) {
		defer wg.Done()
		jobs, err := searchJob(q, region)
		if err != nil {
			logger.Println(err)
		}

		for _, job := range jobs {
			j <- job
		}
	}(query, job)

	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
		close(job)
	}()

	for {
		select {
		case j := <-job:
			if j.Description != "" {
				foundJobs = append(foundJobs, j)
			}
		case <-done:
			stop := time.Now()
			elapsed := stop.Sub(start).String()

			c.Response().Header().Set("Content-Type", "application/json")
			c.Response().WriteHeader(http.StatusOK)

			response := make(map[string]interface{})

			if len(foundJobs) > 0 {
				response["jobs"] = foundJobs
			} else {
				response["jobs"] = make([]types.Job, 0)
			}

			response["elapsed"] = elapsed
			return json.NewEncoder(c.Response()).Encode(returnMsg{Success: true, Body: response})
		}
	}

	return nil
}

// GetRandomJobs gets random indexed jobs
func (h *Handlers) GetRandomJobs(c echo.Context) error {
	var jobs []types.Job
	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	number := c.QueryParam("n")
	if number == "" {
		return json.NewEncoder(c.Response()).Encode(map[string]interface{}{"jobs": jobs})
	}

	numJobs, err := strconv.Atoi(number)
	if err != nil {
		return json.NewEncoder(c.Response()).Encode(map[string]interface{}{"jobs": jobs})
	}

	jobs, err = getLastIndexedJobs(numJobs)
	if err != nil {
		logger.Println(err)
		return json.NewEncoder(c.Response()).Encode(map[string]interface{}{"jobs": jobs})
	}

	return json.NewEncoder(c.Response()).Encode(map[string]interface{}{"jobs": jobs})
}

// searchJob searches for occurrences of jobs and returns them
func searchJob(query, region string) ([]types.Job, error) {
	var jobs []types.Job

	jobSearchResults, err := database.SearchWithIndex(query, region)
	if err != nil {
		return jobs, err
	}

	for _, v := range jobSearchResults.Hits {
		jobs = append(jobs, types.Job{
			URL:         v.Fields["url"].(string),
			Description: v.Fields["desc"].(string),
			Region:      v.Fields["region"].(string),
			PostedOn:    v.Fields["posted_on"].(string),
			Company:     v.Fields["company"].(string),
		})
	}

	return jobs, nil
}

func getLastIndexedJobs(num int) ([]types.Job, error) {
	var jobs []types.Job

	index, err := database.GetBleveIndex()
	if err != nil {
		return jobs, err
	}

	fields := []string{"url", "desc", "region", "posted_on", "company"}
	numDocs := num

	jobResults, err := database.GetLastNDocs(index, numDocs, fields)
	if err != nil {
		return jobs, err
	}

	for _, v := range jobResults.Hits {
		jobs = append(jobs, types.Job{
			URL:         v.Fields["url"].(string),
			Description: v.Fields["desc"].(string),
			Region:      v.Fields["region"].(string),
			PostedOn:    v.Fields["posted_on"].(string),
			Company:     v.Fields["company"].(string),
		})
	}

	return jobs, nil
}
