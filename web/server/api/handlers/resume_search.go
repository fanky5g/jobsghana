package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/labstack/echo"
)

// FindResume searches resumes based on user query sent
func (h *Handlers) FindResume(c echo.Context) error {
	start := time.Now()
	query := c.QueryParam("query")
	location := c.QueryParam("location")

	profiles, err := auth.SearchProfile(query, location)

	if err != nil {
		c.Error(errServer)
		logger.Println(err)
		return errServer
	}

	stop := time.Now()
	elapsed := stop.Sub(start).String()

	c.Response().Header().Set("Content-Type", "application/json")
	c.Response().WriteHeader(http.StatusOK)

	response := make(map[string]interface{})

	response["profiles"] = profiles
	response["elapsed"] = elapsed

	return json.NewEncoder(c.Response()).Encode(response)
}

// SuggestResume gets autocomplete suggestions for resume search
// func (h *Handlers) SuggestResume(c echo.Context) error {
// 	query := c.QueryParam("query")
// 	suggestions := make(chan string)
// 	var returnSuggestions []string

// 	var wg sync.WaitGroup
// 	wg.Add(1)

// 	go func(q string, s chan<- string) {
// 		defer wg.Done()
// 		profileSuggestions, err := auth.GetProfileSuggestions(q)
// 		if err != nil {
// 			logger.Println(err)
// 		}

// 		for _, profile := range profileSuggestions {
// 			s <- profile
// 		}
// 	}(query, suggestions)

// 	done := make(chan struct{})
// 	go func() {
// 		wg.Wait()
// 		close(done)
// 		close(suggestions)
// 	}()

// 	for {
// 		select {
// 		case suggestion := <-suggestions:
// 			returnSuggestions = append(returnSuggestions, suggestion)
// 		case <-done:
// 			c.Response().Header().Set("Content-Type", "application/json")
// 			c.Response().WriteHeader(http.StatusOK)

// 			return json.NewEncoder(c.Response()).Encode(returnMsg{Success: true, Body: returnSuggestions})
// 		}
// 	}

// 	return nil
// }
