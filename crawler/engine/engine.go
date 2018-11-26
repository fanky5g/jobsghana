package engine

import (
	"github.com/PuerkitoBio/gocrawl"
	"github.com/PuerkitoBio/goquery"
	"net/http"
)

// JobCrawler crawls the internet(gh domain) and saves all jobs it finds for easy searching
type JobCrawler struct {
	Extender CrawlExtender
}

// CrawlExtender provides extender options for gocrawl
type CrawlExtender struct {
	*gocrawl.DefaultExtender
}

// Visit overrides gocrawl default visit using goquery
func (x *CrawlExtender) Visit(ctx *gocrawl.URLContext, res *http.Response, doc *goquery.Document) (interface{}, bool) {
	if doc != nil {
		err := ProcessJob(doc, processorFunc)
		if err != nil {
			return err, false
		}
	}

	return nil, true
}

// End sends a done signal to our getjobs
func (x *CrawlExtender) End(err error) {
	done <- true
}

// Filter overrides gocrawl default filter.
func (x *CrawlExtender) Filter(ctx *gocrawl.URLContext, isVisited bool) bool {
	// crawl base hostnames at most twice
	if _, ok := baseCrawledCount[ctx.NormalizedURL().String()]; ok {
		if baseCrawledCount[ctx.NormalizedURL().String()] < 2 {
			baseCrawledCount[ctx.NormalizedURL().String()] = baseCrawledCount[ctx.NormalizedURL().String()] + 1
			isVisited = false
		}
	}

	return !isVisited && indexURLsWithPattern.MatchString(ctx.NormalizedURL().String())
}
