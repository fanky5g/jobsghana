package ghanacurrentjobs

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
	sitesToCrawl := []string{"http://www.ghanacurrentjobs.com/"}
	indexJobWithURLPattern := regexp.MustCompile(`^https?:\/\/(www\.)?ghanacurrentjobs\.com\/?$|https?:\/\/(www\.)?ghanacurrentjobs\.com\/category\/[a-z0-9]+(?:-[a-z0-9]+)*$|https?:\/\/(www\.)?ghanacurrentjobs\.com\/page\/\d+$|https?:\/\/(www\.)?ghanacurrentjobs\.com\/category\/[a-z0-9]+(?:-[a-z0-9]+)*\/page\/\d+$`)

	jobs := engine.Crawl(2000, sitesToCrawl, indexJobWithURLPattern, processor)

	if len(jobs) > 0 {
		w := &bytes.Buffer{}
		r := json.NewEncoder(w)

		err := r.Encode(map[string]interface{}{"jobs": jobs})

		if err != nil {
			return "server error", errors.New("Jobs encoding failed")
		}

		log.Infof("Indexing %s Jobs from ghanacurrentjobs.com", len(jobs))

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
		doc.Find(".content .row.entry").Each(func(i int, s *goquery.Selection) {
			listingTitle := s.Find(".text-left").Children().First().Find("strong").Text()
			company := s.Find(".text-left").Children().Last().Text()
			location := strings.TrimSpace(s.Find(".special").Text())
			link, _ := s.Parent().Attr("href")

			if strings.TrimSpace(company) == "" {
				company = "A Reputable Company"
			}

			region, city := engine.MapRegionAndCity(listingTitle)

			if strings.HasPrefix(link, "/") {
				link = strings.TrimSuffix(doc.Url.String(), "/") + link
			}

			if location == "" && region != "" {
				location = region
			}

			jobs = append(jobs, types.Job{
				URL:         link,
				Description: listingTitle,
				Company:     company,
				Region:      location,
				City:        city,
			})
		})
	}

	return jobs
}
