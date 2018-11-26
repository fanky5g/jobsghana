package engine

import (
	"github.com/fanky5g/xxxinafrica/crawler/types"
	"github.com/PuerkitoBio/goquery"
)

// collector aggregates jobs into one structure which we'll return after all crawling is over
var collector []types.Job
var done = make(chan bool, 1)

// ProcessJob takes a url visited and checks if it matches some specific job query parameters..and then saves them to database
func ProcessJob(dd interface{}, processor func(*goquery.Document) []types.Job) error {
	doc := dd.(*goquery.Document)

	jobs := processor(doc)
	for _, job := range jobs {
		collector = append(collector, job)
	}

	return nil
}
