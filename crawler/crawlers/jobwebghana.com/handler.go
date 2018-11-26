package jobwebghana

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
	sitesToCrawl := []string{"http://jobwebghana.com/jobs"}
	indexJobWithURLPattern := regexp.MustCompile(`^https?:\/\/(www\.)?(jobwebghana\.com\/jobs\/page\/\d+)|https?:\/\/(www\.)?jobwebghana\.com\/jobs\/?$`)

	jobs := engine.Crawl(2000, sitesToCrawl, indexJobWithURLPattern, processor)

	if len(jobs) > 0 {
		w := &bytes.Buffer{}
		r := json.NewEncoder(w)

		err := r.Encode(map[string]interface{}{"jobs": jobs})

		if err != nil {
			return "server error", errors.New("Jobs encoding failed")
		}

		log.Infof("Indexing %s Jobs from jobwebghana", len(jobs))

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
		doc.Find(".jobs .job").Each(func(i int, s *goquery.Selection) {
			listingTitle := s.Find("#titlo strong a").Text()
			location := strings.TrimSpace(strings.Replace(s.Find("#location").Text(), "Location: ", "", -1))
			datePosted := strings.TrimSpace(s.Find(".year").Text())
			link, _ := s.Find("#titlo strong a").Attr("href")

			if strings.HasPrefix(link, "/") {
				link = strings.TrimSuffix(doc.Url.String(), "/") + link
			}

			timePosted := util.Parse(normalizeDate(datePosted))
			JavascriptISOString := "2006-01-02T15:04:05.999Z07:00"

			var calculatedTimeString string
			if len(timePosted) > 0 {
				calculatedTimeString = timePosted[0].UTC().Format(JavascriptISOString)
			}

			listingDetails := strings.Split(listingTitle, ":")

			var company string
			if len(listingDetails) > 1 {
				company = strings.TrimSpace(strings.Replace(listingDetails[0], "Job Vacancy", "", -1))
				listingTitle = strings.TrimSpace(listingDetails[1])
			}

			region, city := engine.MapRegionAndCity(listingTitle)
			if company == "" && region != "" {
				location = region
			}

			if strings.TrimSpace(company) == "" {
				company = "A Reputable Company"
			}

			jobs = append(jobs, types.Job{
				URL:         link,
				Description: listingTitle,
				Company:     company,
				PostedOn:    calculatedTimeString,
				Region:      location,
				City:        city,
			})
		})
	}

	return jobs
}

func normalizeDate(timeString string) string {
	timeString = strings.ToLower(timeString)
	r := strings.NewReplacer(
		"jan", "1",
		"feb", "2",
		"mar", "3",
		"march", "3",
		"april", "4",
		"apr", "4",
		"may", "5",
		"june", "6",
		"jun", "6",
		"july", "7",
		"jul", "7",
		"aug", "8",
		"august", "8",
		"sep", "9",
		"oct", "10",
		"nov", "11",
		"dec", "12",
	)

	timeString = r.Replace(timeString)
	timeStringArray := strings.Split(timeString, "/")

	return fmt.Sprintf("%s/%s/%s", timeStringArray[1], timeStringArray[0], timeStringArray[2])
}

func main() {}
