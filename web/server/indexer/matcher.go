package indexer

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
)

// BuildJobMatcher builds regex string that tests if string contains job
func BuildJobMatcher() *regexp.Regexp {
	file, err := os.Open("jobs.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	regexString := `(?i)`

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// fmt.Println(scanner.Text())
		regexString = fmt.Sprintf("%s%s|", regexString, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	// remove last |
	regexString = strings.TrimSuffix(regexString, "|")
	return regexp.MustCompile(regexString)
}

// BuildCityMatcher returns regex expression to match the major cities
func BuildCityMatcher() *regexp.Regexp {
	file, err := os.Open("cities.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	regexString := `(?i)`

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// fmt.Println(scanner.Text())
		regexString = fmt.Sprintf("%s[[:blank:]]%s\b|", regexString, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	// remove last |
	regexString = strings.TrimSuffix(regexString, "|")
	return regexp.MustCompile(regexString)
}

// MapCityToRegion maps cities fetched to regions
func MapCityToRegion(city string) string {
	if _, ok := cityToRegion[strings.ToLower(city)]; ok {
		return cityToRegion[strings.ToLower(city)]
	}

	return ""
}

// FilterJobs filters links provided to check if it is a possible job listing
func FilterJobs(jobs []types.Job) ([]types.Job, error) {
	var filtered []types.Job
	r := BuildJobMatcher()
	re := BuildCityMatcher()

	for _, job := range jobs {
		if r.MatchString(job.Description) {
			if re.MatchString(job.Description) {
				if job.Region == "" {
					job.Region = MapCityToRegion(strings.TrimSpace(re.FindStringSubmatch(job.Description)[0]))
				}
			} else if re.MatchString(job.URL) {
				if job.Region == "" {
					job.Region = MapCityToRegion(strings.TrimSpace(re.FindStringSubmatch(job.URL)[0]))
				}
			}

			filtered = append(filtered, job)
		}
	}

	return filtered, nil
}
