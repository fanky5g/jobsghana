package businessghana

import (
	"github.com/fanky5g/xxxinafrica/crawler/engine"
	"github.com/fanky5g/xxxinafrica/crawler/log"
	"github.com/fanky5g/xxxinafrica/crawler/types"
	"github.com/fanky5g/xxxinafrica/crawler/util"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
)

// DoCrawl => crawl job
func DoCrawl() (interface{}, error) {
	sitesToCrawl := []string{"http://businessghana.com/site/jobs/listings"}
	indexJobWithURLPattern := regexp.MustCompile(`^https?:\/\/(www\.)?(businessghana\.com\/site\/jobs\/listings\?page=\d+)|https?:\/\/(www\.)?businessghana\.com\/site\/jobs\/listings\/?$`)

	jobs := engine.Crawl(2000, sitesToCrawl, indexJobWithURLPattern, processor)

	if len(jobs) > 0 {
		w := &bytes.Buffer{}
		r := json.NewEncoder(w)

		err := r.Encode(map[string]interface{}{"jobs": jobs})

		if err != nil {
			return "server error", errors.New("Jobs encoding failed")
		}

		log.Infof("Indexing %s Jobs from businessghana.com", len(jobs))

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
		doc.Find(".main-content .all-listings-row").Each(func(i int, s *goquery.Selection) {
			listingTitle := s.Find(".listing-title a").Text()
			location := strings.TrimSpace(s.Find(".more-row .misc").Text())
			datePosted := strings.TrimSpace(s.Find(".more-row strong").Text())
			link, _ := s.Find(".listing-title a").Attr("href")

			timePosted := util.Parse(normalizeDate(datePosted))
			JavascriptISOString := "2006-01-02T15:04:05.999Z07:00"

			region, city := engine.MapRegionAndCity(listingTitle)

			if location == "" && region != "" {
				location = region
			}

			var calculatedTimeString string
			if len(timePosted) > 0 {
				calculatedTimeString = timePosted[0].UTC().Format(JavascriptISOString)
			}

			if strings.HasPrefix(link, "/") {
				link = strings.TrimSuffix(doc.Url.String(), "/") + link
			}

			if listingTitle != "" && link != "" {
				jobs = append(jobs, types.Job{
					URL:         link,
					Description: listingTitle,
					PostedOn:    calculatedTimeString,
					Region:      location,
					Company:     "A Reputable Company",
					City:        city,
				})
			}
		})
	}

	return jobs
}

func normalizeDate(timeString string) string {
	timeString = strings.Replace(timeString, "-", "/", -1)
	timeStringArray := strings.Split(timeString, "/")

	return fmt.Sprintf("%s/%s/%s", timeStringArray[1], timeStringArray[0], timeStringArray[2])
}
