package jobberman

import (
	"github.com/fanky5g/xxxinafrica/crawler/engine"
	"github.com/fanky5g/xxxinafrica/crawler/log"
	"github.com/fanky5g/xxxinafrica/crawler/types"
	"github.com/fanky5g/xxxinafrica/crawler/util"
	"bytes"
	"encoding/json"
	"errors"
	"github.com/PuerkitoBio/goquery"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
)

// DoCrawl => crawl job
func DoCrawl() (interface{}, error) {
	sitesToCrawl := []string{"http://www.jobberman.com.gh/jobs-in-ghana"}
	indexJobWithURLPattern := regexp.MustCompile(`^https?:\/\/(www\.)?(jobberman\.com\.gh\/jobs-in-ghana\/\?page=\d+&ipp=\d+&Ns=\d+)|https?:\/\/(www\.)?jobberman\.com\.gh\/jobs-in-ghana`)

	jobs := engine.Crawl(2000, sitesToCrawl, indexJobWithURLPattern, processor)

	if len(jobs) > 0 {
		w := &bytes.Buffer{}
		r := json.NewEncoder(w)

		err := r.Encode(map[string]interface{}{"jobs": jobs})

		if err != nil {
			return "server error", errors.New("Jobs encoding failed")
		}

		log.Infof("Indexing %s Jobs from jobberman.com.gh", len(jobs))

		req, err := http.NewRequest("POST", "https://talentsinafrica.com/api/v1/jobs/index", w)
		req.Header.Set("Content-Type", "application/json")

		client := util.GetClient()
		response, err := client.Do(req)

		if err != nil {
			return "server error", err
		}

		defer response.Body.Close()
		b, err := ioutil.ReadAll(response.Body)
		return string(b), err
	}

	return "No jobs found", nil
}

func processor(doc *goquery.Document) []types.Job {
	var jobs []types.Job
	if doc != nil {
		doc.Find(".search-results").Each(func(i int, s *goquery.Selection) {
			listingTitle := s.Find(".job-title a").Text()
			company := s.Find(".job-cmpy").Text()
			location := s.Find(".job-locatn").Text()
			datePosted := s.Find(".job-date").Text()
			link, _ := s.Find(".job-title a").Attr("href")

			if strings.HasPrefix(link, "/") {
				link = strings.TrimSuffix(doc.Url.String(), "/") + link
			}

			timePosted := util.Parse(strings.TrimSpace(datePosted))
			JavascriptISOString := "2006-01-02T15:04:05.999Z07:00"

			var calculatedTimeString string
			if len(timePosted) > 0 {
				calculatedTimeString = timePosted[0].UTC().Format(JavascriptISOString)
			}

			region, city := engine.MapRegionAndCity(listingTitle)
			if location == "" && region != "" {
				location = region
			}

			if strings.TrimSpace(company) == "" {
				company = "A Reputable Company"
			}

			jobs = append(jobs, types.Job{
				URL:         strings.TrimSpace(link),
				Description: strings.TrimSpace(listingTitle),
				Company:     strings.TrimSpace(company),
				PostedOn:    calculatedTimeString,
				Region:      strings.TrimSpace(location),
				City:        city,
			})
		})

		doc.Find(".search-results-special").Each(func(i int, s *goquery.Selection) {
			listingTitle := s.Find(".job-title a").Text()
			company := s.Find(".job-cmpy").Text()
			location := s.Find(".job-locatn").Text()
			datePosted := s.Find(".job-date").Text()
			link, _ := s.Find(".job-title a").Attr("href")

			timePosted := util.Parse(strings.TrimSpace(datePosted))
			JavascriptISOString := "2006-01-02T15:04:05.999Z07:00"

			var calculatedTimeString string
			if len(timePosted) > 0 {
				calculatedTimeString = timePosted[0].UTC().Format(JavascriptISOString)
			}

			jobs = append(jobs, types.Job{
				URL:         strings.TrimSpace(link),
				Description: strings.TrimSpace(listingTitle),
				Company:     strings.TrimSpace(company),
				PostedOn:    calculatedTimeString,
				Region:      strings.TrimSpace(location),
			})
		})
	}

	return jobs
}
