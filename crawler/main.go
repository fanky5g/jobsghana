package main

import (
	"github.com/fanky5g/xxxinafrica/crawler/crawlers/businessghana.com"
	"github.com/fanky5g/xxxinafrica/crawler/crawlers/ghanacurrentjobs.com"
	"github.com/fanky5g/xxxinafrica/crawler/crawlers/jobberman.com.gh"
	"github.com/fanky5g/xxxinafrica/crawler/crawlers/jobhouse.com.gh"
	"github.com/fanky5g/xxxinafrica/crawler/crawlers/joblistghana.com"
	"github.com/fanky5g/xxxinafrica/crawler/crawlers/jobwebghana.com"
	"github.com/fanky5g/xxxinafrica/crawler/log"
	"time"
)

func main() {
	log.Info("Crawler init\n")
	log.Infof("Start time: %s", time.Now().UTC().String())
	log.Info("Fetching jobs from jobberman.com.gh")

	result, err := jobberman.DoCrawl()
	if err != nil {
		log.Debugf("Jobberman crawl returned error: %s", err)
	}

	log.Infof("Jobberman crawl result: %s", result)
	log.Info("Fetching jobs from businessghana.com")

	result, err = businessghana.DoCrawl()
	if err != nil {
		log.Debugf("Businessghana crawl returned error: %s", err)
	}

	log.Infof("Businessghana crawl result: %s", result)
	log.Info("Fetching jobs from ghanacurrentjobs.com")

	result, err = ghanacurrentjobs.DoCrawl()
	if err != nil {
		log.Debugf("Ghanacurrentjobs crawl returned error: %s", err)
	}

	log.Infof("Ghanacurrentjobs crawl result: %s", result)
	log.Info("Fetching jobs from jobhouse.com.gh")

	result, err = jobhouse.DoCrawl()
	if err != nil {
		log.Debugf("Jobhouse crawl returned error: %s", err)
	}

	log.Infof("Jobhouse crawl result: %s", result)
	log.Info("Fetching jobs from joblistghana.com")

	result, err = joblistghana.DoCrawl()
	if err != nil {
		log.Debugf("Joblistghana crawl returned error: %s", err)
	}

	log.Infof("Joblistghana crawl result: %s", result)
	log.Info("Fetching jobs from jobwebghana.com")

	result, err = jobwebghana.DoCrawl()
	if err != nil {
		log.Debugf("Jobwebghana crawl returned error: %s", err)
	}
	log.Infof("Jobwebghana crawl result: %s", result)

	log.Info("Crawling complete")
	log.Infof("End time: %s", time.Now().UTC().String())
}
