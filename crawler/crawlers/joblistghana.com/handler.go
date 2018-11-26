package joblistghana

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
	sitesToCrawl := []string{"https://joblistghana.com"}
	indexJobWithURLPattern := regexp.MustCompile(`^https?:\/\/(www\.)?joblistghana\.com\/?$|https?:\/\/(www\.)?joblistghana\.com\/category|https?:\/\/(www\.)?(joblistghana\.com\/page=\d+)`)

	jobs := engine.Crawl(2000, sitesToCrawl, indexJobWithURLPattern, processor)

	if len(jobs) > 0 {
		w := &bytes.Buffer{}
		r := json.NewEncoder(w)

		err := r.Encode(map[string]interface{}{"jobs": jobs})

		if err != nil {
			return "server error", errors.New("Jobs encoding failed")
		}

		log.Infof("Indexing %s Jobs from joblistghana.com", len(jobs))

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
		doc.Find(".employers .bank").Each(func(i int, s *goquery.Selection) {
			listingTitle := s.Find(".Trust h3 a").Text()
			datePosted := s.Find(".Trust-bot-right ul").Children().First().Find("img").Text()
			link, _ := s.Find(".Trust h3 a").Attr("href")

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

			jobs = append(jobs, types.Job{
				URL:         strings.TrimSpace(link),
				Description: strings.TrimSpace(listingTitle),
				Company:     "A Reputable Company",
				PostedOn:    calculatedTimeString,
				Region:      region,
				City:        city,
				// Region:      strings.TrimSpace(location),
			})
		})
	}

	return jobs
}

func main() {}
