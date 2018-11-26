package engine

import (
	"github.com/fanky5g/xxxinafrica/crawler/log"
	"github.com/fanky5g/xxxinafrica/crawler/types"
	"github.com/PuerkitoBio/gocrawl"
	"github.com/PuerkitoBio/goquery"
	"regexp"
	"time"
)

var (
	ext = &CrawlExtender{
		new(gocrawl.DefaultExtender),
	}
	crawler              = gocrawl.NewCrawler(ext)
	indexURLsWithPattern *regexp.Regexp
	processorFunc        func(*goquery.Document) []types.Job
	baseCrawledCount     = make(map[string]int)
)

// Crawl crawls the internet for posted jobs
func Crawl(maxJobs int, sitesToCrawl []string, urlPattern *regexp.Regexp, processor func(*goquery.Document) []types.Job) []types.Job {
	indexURLsWithPattern = urlPattern
	processorFunc = processor

	for _, site := range sitesToCrawl {
		baseCrawledCount[site] = 0
	}

	crawler.Options.LogFlags = gocrawl.LogError
	crawler.Options.SameHostOnly = true
	crawler.Options.MaxVisits = 2000
	crawler.Options.LogFlags = gocrawl.LogAll

	crawler.Options.CrawlDelay = 1 * time.Second

	err := getJobs(maxJobs, sitesToCrawl)
	if err != nil {
		log.Debug(err)
	}

	return collector
}

func getJobs(maxJobs int, sitesToCrawl []string) error {
	go crawler.Run(sitesToCrawl)

	for {
		if len(collector) >= maxJobs {
			return nil
		}

		select {
		case <-done:
			return nil
		default:
			continue
		}
	}
	return nil
}
