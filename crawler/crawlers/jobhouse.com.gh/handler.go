package jobhouse

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
	"mime/multipart"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
)

// Response holds fields for json values returned by jobhouse
type Response struct {
	FoundJobs bool   `json:"found_jobs"`
	HTML      string `json:"html"`
	NumPages  int    `json:"max_num_pages"`
}

var (
	siteURL   = "https://jobhouse.com.gh/jobs-in-ghana/jm-ajax/get_listings/"
	collector []types.Job
)

// DoCrawl => crawl job
func DoCrawl() (interface{}, error) {
	pageNumber := 1 //start from first page
	perPage := 5000 //make huge perpage so we cut down number of visits

	jhResp, err := getJobs(pageNumber, perPage)
	if err != nil {
		return "failed", err
	}

	// index first page
	processJobs(jhResp)

	var wg sync.WaitGroup
	pages := jhResp.NumPages
	wg.Add(pages - 1)

	for i := pageNumber + 1; i <= pages; i++ {
		go func(pageNum int) {
			defer wg.Done()

			jhResp, err := getJobs(pageNum, perPage)
			if err != nil {
				fmt.Println(err)
				return
			}

			processJobs(jhResp)
		}(i)
	}

	wg.Wait()

	if len(collector) > 0 {
		w := &bytes.Buffer{}
		r := json.NewEncoder(w)

		err := r.Encode(map[string]interface{}{"jobs": collector})

		if err != nil {
			return "server error", errors.New("Jobs encoding failed")
		}

		log.Infof("Indexing %s Jobs from jobhouse.com.gh", len(collector))

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

func processJobs(resp *Response) {
	if resp.FoundJobs {
		doc, err := docFromHTML(resp.HTML)
		if err != nil {
			fmt.Println(err)
			return
		}

		processor(doc)
	}
}

func docFromHTML(in string) (*goquery.Document, error) {
	htmlReader := strings.NewReader(in)
	doc, err := goquery.NewDocumentFromReader(htmlReader)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func getJobs(pageNumber int, perPage int) (*Response, error) {
	var responseData *Response

	client := util.GetClient()

	formData, body, err := createFormData(pageNumber, perPage)
	if err != nil {
		return responseData, err
	}

	formData.Close()

	req, _ := http.NewRequest("POST", siteURL, body)
	req.Header.Set("Content-Type", formData.FormDataContentType())

	res, err := client.Do(req)
	if err != nil {
		return responseData, err
	}

	defer res.Body.Close()
	b, err := ioutil.ReadAll(res.Body)

	err = json.Unmarshal(b, &responseData)
	if err != nil {
		return responseData, err
	}

	return responseData, err
}

func processor(doc *goquery.Document) {
	doc.Find(".job_listing").Each(func(i int, s *goquery.Selection) {
		listingTitle := s.Find(".description h3").Text()
		company := s.Find(".description .company").Text()
		location := s.Find(".description .location").Text()
		datePosted := s.Find(".description .date").Text()
		link, _ := s.Find("a").Attr("href")

		if strings.HasPrefix(link, "/") {
			link = strings.TrimSuffix(doc.Url.String(), "/") + link
		}

		datePosted = monthToWeeks(datePosted)
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

		collector = append(collector, types.Job{
			URL:         strings.TrimSpace(link),
			Description: strings.TrimSpace(listingTitle),
			Company:     strings.TrimSpace(company),
			PostedOn:    calculatedTimeString,
			Region:      strings.TrimSpace(location),
			City:        city,
		})
	})
}

func createFormData(pageNumber int, perPage int) (*multipart.Writer, *bytes.Buffer, error) {
	body := &bytes.Buffer{}
	wr := multipart.NewWriter(body)

	fw, err := wr.CreateFormField("per_page")
	if err != nil {
		return nil, nil, err
	}

	_, err = fw.Write([]byte(fmt.Sprint(perPage)))
	if err != nil {
		return nil, nil, err
	}

	fw, err = wr.CreateFormField("orderby")
	if err != nil {
		return nil, nil, err
	}

	_, err = fw.Write([]byte("full"))
	if err != nil {
		return nil, nil, err
	}

	fw, err = wr.CreateFormField("order")
	if err != nil {
		return nil, nil, err
	}

	_, err = fw.Write([]byte("DESC"))
	if err != nil {
		return nil, nil, err
	}

	fw, err = wr.CreateFormField("page")
	if err != nil {
		return nil, nil, err
	}

	_, err = fw.Write([]byte(fmt.Sprint(pageNumber)))
	if err != nil {
		return nil, nil, err
	}

	fw, err = wr.CreateFormField("show_pagination")
	if err != nil {
		return nil, nil, err
	}

	_, err = fw.Write([]byte(fmt.Sprint(false)))
	if err != nil {
		return nil, nil, err
	}

	return wr, body, nil
}

func monthToWeeks(timeString string) string {
	r := regexp.MustCompile(`(\d+) months?`)
	if r.MatchString(timeString) {
		matches := r.FindStringSubmatch(timeString)
		monthString := matches[1]
		month, _ := strconv.ParseInt(monthString, 10, 64)

		monthString = fmt.Sprintf("%v weeks ago", month*4)

		return monthString
	}

	y := regexp.MustCompile(`(\d+) years?`)
	if y.MatchString(timeString) {
		matches := y.FindStringSubmatch(timeString)
		yearString := matches[1]
		year, _ := strconv.ParseInt(yearString, 10, 64)

		yearString = fmt.Sprintf("%v weeks ago", year*52)

		return yearString
	}

	return timeString
}

func main() {}
