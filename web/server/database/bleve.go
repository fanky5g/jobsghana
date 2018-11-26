package database

import (
	"strings"

	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/log2"
	"github.com/blevesearch/bleve"
)

var (
	logger = log2.Log
	cfg, _ = config.GetConfig()
	// BleveIndex holds bleve job index
	BleveIndex bleve.Index
	// BleveAlias bleve.IndexAlias

	// BleveUserIndex gets bleve index for user indexing
	BleveUserIndex bleve.Index

	// EmptyIndex => empty index flag
	EmptyIndex = "NULL"
)

// GetBleveIndex returns application job indexer
func GetBleveIndex() (bleve.Index, error) {
	if BleveIndex != nil {
		return BleveIndex, nil
	}

	bleveFile := cfg.BleveIndexPath
	bleveIndex, err := bleve.Open(bleveFile)
	if err != nil {
		bleveIndex, err = createJobIndex()
	}

	BleveIndex = bleveIndex
	return BleveIndex, err
}

// GetBleveUserIndex returns indexing for user searches
func GetBleveUserIndex() (bleve.Index, error) {
	if BleveUserIndex != nil {
		return BleveUserIndex, nil
	}

	bleveFile := cfg.BleveProfilePath
	bleveIndex, err := bleve.Open(bleveFile)
	if err != nil {
		bleveIndex, err = createUserIndex()
	}

	BleveUserIndex = bleveIndex
	return BleveUserIndex, err
}

// createUserIndex creates our bleve user index
func createUserIndex() (bleve.Index, error) {
	mapping := bleve.NewIndexMapping()
	profileMapping := bleve.NewDocumentMapping()

	jobSectorMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("jobSector", jobSectorMapping)

	jobTitleMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("jobTitle", jobTitleMapping)

	levelMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("level", levelMapping)

	salaryExpectationMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("salaryExpectation", salaryExpectationMapping)

	locationMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("location", locationMapping)

	regionMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("pref_loc", regionMapping)

	jobTypeMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("jobType", jobTypeMapping)

	idMapping := bleve.NewTextFieldMapping()
	profileMapping.AddFieldMappingsAt("id", idMapping)

	mapping.AddDocumentMapping("profile", profileMapping)

	bIndex, err := bleve.New(cfg.BleveProfilePath, mapping)
	if err != nil {
		logger.Println(err)
		return bIndex, err
	}

	return bIndex, nil
}

// createJobIndex creates our bleve job index
func createJobIndex() (bleve.Index, error) {
	mapping := bleve.NewIndexMapping()
	jobMapping := bleve.NewDocumentMapping()

	descMapping := bleve.NewTextFieldMapping()
	jobMapping.AddFieldMappingsAt("desc", descMapping)

	urlMapping := bleve.NewTextFieldMapping()
	jobMapping.AddFieldMappingsAt("url", urlMapping)

	regionMapping := bleve.NewTextFieldMapping()
	regionMapping.IncludeInAll = false
	regionMapping.Analyzer = "en"
	jobMapping.AddFieldMappingsAt("region", regionMapping)

	companyMapping := bleve.NewTextFieldMapping()
	jobMapping.AddFieldMappingsAt("company", companyMapping)

	dateMapping := bleve.NewTextFieldMapping()
	jobMapping.AddFieldMappingsAt("posted_on", dateMapping)

	mapping.AddDocumentMapping("job", jobMapping)

	bIndex, err := bleve.New(cfg.BleveIndexPath, mapping)
	if err != nil {
		logger.Println(err)
		return bIndex, err
	}

	return bIndex, nil
}

// SearchWithIndex searches bleve index
func SearchWithIndex(queryString, region string) (*bleve.SearchResult, error) {
	descQuery := bleve.NewMatchQuery(queryString)
	descQuery.SetField("desc")

	conjuncts := []bleve.Query{descQuery}

	if region == "" {
		allRegionsQuery := bleve.NewMatchAllQuery()
		allRegionsQuery.SetField("region")
		conjuncts = append(conjuncts, allRegionsQuery)
	} else {
		regionQuery := bleve.NewMatchQuery(strings.TrimSpace(strings.Replace(region, "region", "", -1)))
		regionQuery.SetField("region")
		conjuncts = append(conjuncts, regionQuery)
	}

	query := bleve.NewConjunctionQuery(conjuncts)

	search := bleve.NewSearchRequest(query)
	search.SortBy([]string{"-posted_on", "desc"})

	bleveIndex, err := GetBleveIndex()

	// we only need the url and description
	search.Fields = []string{"url", "desc", "region", "posted_on", "company"}

	if err != nil {
		return nil, err
	}

	search.Size = 1000 //maximum search permitted

	searchResults, err := bleveIndex.Search(search)
	if err != nil {
		logger.Println(err)
		return searchResults, err
	}

	return searchResults, nil
}

// SearchProfileWithIndex searches bleve index
func SearchProfileWithIndex(queryString, location string) (*bleve.SearchResult, error) {
	titleQuery := bleve.NewMatchQuery(queryString)
	titleQuery.SetField("jobTitle")

	conjuncts := []bleve.Query{titleQuery}

	if location == "" {
		allLocationsQuery := bleve.NewMatchAllQuery()
		allLocationsQuery.SetField("location")
		conjuncts = append(conjuncts, allLocationsQuery)
	} else {
		locationQuery := bleve.NewMatchQuery(location)
		locationQuery.SetField("location")
		conjuncts = append(conjuncts, locationQuery)
	}

	query := bleve.NewConjunctionQuery(conjuncts)

	search := bleve.NewSearchRequest(query)
	search.Size = 1000
	bleveIndex, err := GetBleveUserIndex()

	search.Fields = []string{"id", "jobSector", "jobTitle", "location", "pref_loc", "level", "salaryExpectation", "jobType"}

	searchResults, err := bleveIndex.Search(search)
	if err != nil {
		logger.Println(err)
		return searchResults, err
	}

	return searchResults, nil
}

// GetLastNDocs gets last n documents of the index specified
func GetLastNDocs(index bleve.Index, numDocs int, fields []string) (*bleve.SearchResult, error) {
	query := bleve.NewMatchAllQuery()
	search := bleve.NewSearchRequest(query)
	search.Size = numDocs
	search.Fields = fields

	searchResults, err := index.Search(search)
	if err != nil {
		logger.Println(err)
		return searchResults, err
	}

	return searchResults, nil
}
