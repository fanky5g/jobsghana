package engine

import (
	// "github.com/pkg/profile"
	// "github.com/eawsy/aws-lambda-go-core/service/lambda/runtime"
	// "github.com/fanky5g/xxxinafrica/web/server/config"
	// "github.com/fanky5g/xxxinafrica/web/server/database"
	// "encoding/json"
	// "github.com/fatih/structs"
	// "github.com/stretchr/testify/assert"
	// "io/ioutil"
	// "os"
	// "regexp"
	"testing"
	// "time"
)

func TestMapCityToRegion(t *testing.T) {
	stringToTest := "software developer needed in abeka"
	region, city := MapRegionAndCity(stringToTest)
	t.Log(region, city)
}

// // func TestCrawl(t *testing.T) {
// // 	ctx := runtime.Context{}
// // 	var endTime = time.Now().Add(time.Minute * 30)

// // 	ctx.RemainingTimeInMillis = func() int64 {
// // 		return endTime.Sub(time.Now()).Nanoseconds()
// // 	}

// // 	jobs := Crawl(1000, &ctx)
// // 	assert.NotEmpty(t, jobs)
// // 	t.Log(jobs)
// // }

// func TestSearch(t *testing.T) {
// 	jobs, err := searchJob("software engineer", "greater accra")
// 	assert.NoError(t, err)
// 	// t.Log(jobs)
// 	t.Log(len(jobs))

// 	resumes, err := searchResume("software engineer", "greater accra")
// 	assert.NoError(t, err)
// 	// t.Log(resumes)
// 	t.Log(len(resumes))
// }

// func searchJob(query, region string) ([]Job, error) {
// 	var jobs []Job

// 	jobSearchResults, err := database.SearchWithIndex(query, region)
// 	if err != nil {
// 		return jobs, err
// 	}

// 	for _, v := range jobSearchResults.Hits {
// 		jobs = append(jobs, Job{
// 			URL:         v.Fields["url"].(string),
// 			Description: v.Fields["desc"].(string),
// 			Region:      v.Fields["region"].(string),
// 			PostedOn:    v.Fields["posted_on"].(string),
// 			Company:     v.Fields["company"].(string),
// 		})
// 	}

// 	return jobs, nil
// }

// // [map[ID:5 jobTitle:Software Engineer region:Greater Accra]]

// func searchResume(query, region string) ([]map[string]interface{}, error) {
// 	var results []map[string]interface{}

// 	profileResults, err := database.SearchProfileWithIndex(query, region)
// 	if err != nil {
// 		return results, err
// 	}

// 	for _, v := range profileResults.Hits {
// 		results = append(results, map[string]interface{}{
// 			"ID":       v.Fields["id"].(float64),
// 			"jobTitle": v.Fields["jobTitle"].(string),
// 			"region":   v.Fields["region"].(string),
// 		})
// 	}

// 	return results, nil
// }

// func TestGetLastNJobs(t *testing.T) {
// 	index, err := database.GetBleveIndex()
// 	assert.NoError(t, err)
// 	fields := []string{"url", "desc", "region", "posted_on", "company"}
// 	numDocs := 15

// 	jobResults, err := database.GetLastNDocs(index, numDocs, fields)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, jobResults)

// 	var jobsFound []Job
// 	for _, v := range jobResults.Hits {
// 		jobsFound = append(jobsFound, Job{
// 			URL:         v.Fields["url"].(string),
// 			Description: v.Fields["desc"].(string),
// 			Region:      v.Fields["region"].(string),
// 			PostedOn:    v.Fields["posted_on"].(string),
// 			Company:     v.Fields["company"].(string),
// 		})
// 	}

// 	assert.Equal(t, len(jobsFound), 15)
// 	t.Logf("found %v jobs", len(jobsFound))
// 	t.Log(jobsFound)
// }

// func TestGetLastNResumes(t *testing.T) {
// 	index, err := database.GetBleveUserIndex()
// 	assert.NoError(t, err)
// 	fields := []string{"id", "jobTitle", "region"}
// 	numDocs := 15

// 	resumeResults, err := database.GetLastNDocs(index, numDocs, fields)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, resumeResults)

// 	var resumesFound []map[string]interface{}
// 	for _, v := range resumeResults.Hits {
// 		resumesFound = append(resumesFound, map[string]interface{}{
// "ID":       v.Fields["id"].(float64),
// "jobTitle": v.Fields["jobTitle"].(string),
// "region":   v.Fields["region"].(string),
// 		})
// 	}

// 	t.Logf("found %v resumes", len(resumesFound))
// 	t.Log(resumesFound)
// }

// func TestMatchAndIndexJobs(t *testing.T) {
// 	r := BuildJobMatcher()
// 	assert.NotEmpty(t, r)
// 	re := BuildCityMatcher()
// 	assert.NotEmpty(t, re)

// 	data, err := ioutil.ReadFile("testdata.txt")
// 	assert.NoError(t, err)

// 	var jobs []Job
// 	var matched []Job
// 	var jobsWithRegions []Job

// 	if len(data) != 0 {
// 		err = json.Unmarshal(data, &jobs)
// 		assert.NoError(t, err)
// 		assert.NotEmpty(t, jobs)

// 		m, err := FilterJobs(jobs)
// 		assert.NoError(t, err)
// 		matched = m
// 	}

// 	if len(matched) != 0 {
// 		for _, job := range matched {
// 			if job.Region != "" {
// 				jobsWithRegions = append(jobsWithRegions, job)
// 				continue
// 			}
// 		}
// 	}

// 	t.Logf("Number of Jobs sent %v", len(jobs))
// 	t.Logf("Number of Matched jobs %v", len(matched))
// 	t.Logf("Number of Jobs with regions %v", len(jobsWithRegions))

// 	cfg, _ := config.GetConfig()

// 	// remove existing bleve index
// 	os.Remove(cfg.BleveIndexPath)
// 	assert.NoError(t, IndexJobs(matched))
// }

// func BenchmarkCrawl(b *testing.B) {
// 	b.ReportAllocs()
// 	ctx := runtime.Context{}
// 	var endTime = time.Now().Add(time.Second + 20)

// 	ctx.RemainingTimeInMillis = func() int64 {
// 		return endTime.Sub(time.Now()).Nanoseconds()
// 	}

// 	jobs := Crawl(30, ctx)
// 	assert.NotEmpty(b, jobs)
// }

// func TestSearch(t *testing.T) {
// 	jobs, err := SearchJob("accountant", "")
// 	assert.NoError(t, err)
// 	if assert.NotEmpty(t, jobs) {
// 		for _, job := range jobs {
// 			t.Logf("found %s", job.Description)
// 		}
// 	}
// 	t.Log("done searching")
// }

// func TestRegionDetect(t *testing.T) {
// 	region := RegionDetect("http://www.jobberman.com.gh/job/142518/software-engineers-in-ashanti-region/", "Software Engineers")
// 	assert.NotEmpty(t, region)
// 	assert.Equal(t, region, "ashanti region")
// }

// func TestSuggest(t *testing.T) {
// 	suggestions, err := GetSuggestions("sales manager")
// 	assert.NoError(t, err)
// 	if assert.NotEmpty(t, suggestions) {
// 		for _, entry := range suggestions {
// 			t.Logf("found %s", entry)
// 		}
// 	}
// 	t.Log("done searching")
// }
