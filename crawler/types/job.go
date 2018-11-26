package types

// Job holds job search parameters
type Job struct {
	URL         string `json:"url"`
	Description string `json:"desc"`
	Region      string `json:"region"`
	Company     string `json:"company"`
	City        string `json:"city"`
	PostedOn    string `json:"posted_on"`
}
