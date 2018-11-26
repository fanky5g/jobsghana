package engine

import (
	"regexp"
	"strings"
)

var regionMap = map[string]string{
	"ashanti":         "ashanti region",
	"volta":           "volta region",
	"central region":  "central region",
	"brong ahafo":     "brong-ahafo region",
	"brong-ahafo":     "brong-ahafo region",
	"northern region": "northern region",
	"greater accra":   "greater accra region",
	"accra":           "greater accra region",
	"western":         "western region",
	"western region":  "western region",
	"upper-west":      "upper west region",
	"upper west":      "upper west region",
	"upper-east":      "upper east region",
	"upper east":      "upper east region",
	"eastern region":  "eastern region",
}

// RegionDetect detects the region a job is posted in
func RegionDetect(url string, desc, location string) string {
	r := regexp.MustCompile("(?i)(ashanti|volta|central region|brong ahafo|brong-ahafo|northern region|greater accra|accra|western region|upper-west region|upper west region|upper west|upper east|upper-east|eastern region)")
	// if region is rather in desc, match
	regions := r.FindStringSubmatch(location)
	if len(regions) != 0 {
		return FormatRegion(regions[0])
	}

	regions = r.FindStringSubmatch(url)
	if len(regions) != 0 {
		return FormatRegion(regions[0])
	}

	return ""
}

// FormatRegion formats region phrase into regular strings
func FormatRegion(region string) string {
	region = strings.ToLower(region)
	if _, ok := regionMap[region]; ok {
		return regionMap[region]
	}
	return ""
}
