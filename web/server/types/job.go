package types

// Job holds job search parameters
type Job struct {
	URL         string `json:"url"`
	Description string `json:"desc"`
	Region      string `json:"region"`
	Company     string `json:"company"`
	PostedOn    string `json:"posted_on"`
}
