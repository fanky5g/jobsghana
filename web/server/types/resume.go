package types

import (
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"github.com/jinzhu/gorm"
	"regexp"
	"strings"
)

// Resume holds fields for resume
type Resume struct {
	Basics struct {
		Title  string `json:"title,omitempty"`
		Gender string `json:"gender,omitempty"`
		Name   struct {
			FirstName  string `json:"firstName,omitempty"`
			MiddleName string `json:"surname,omitempty"`
			LastName   string `json:"middleName,omitempty"`
		} `json:"name,omitempty"`
		Email   []string `json:"email,omitempty"`
		Address []string `json:"address,omitempty"`
		URL     []string `json:"url,omitempty"`
		Phone   []string `json:"phone,omitempty"`
		Summary string   `json:"summary,omitempty"`
	} `json:"basics,omitempty"`
	Summary        []map[string]interface{} `json:"summary,omitempty"`
	WorkExperience []WorkExperience         `json:"work_experience,omitempty"`
	// Skills               []map[string]interface{} `json:"skills,omitempty"`
	// EducationAndTraining []map[string]interface{} `json:"education_and_training,omitempty"`
	// Accomplishments      []map[string]interface{} `json:"accomplishments,omitempty"`
	// Awards               []map[string]interface{} `json:"awards,omitempty"`
	// Credibility          []map[string]interface{} `json:"credibility,omitempty"`
	// Extracurricular      []map[string]interface{} `json:"extracurricular,omitempty"`
	// Miscellaneous        []map[string]interface{} `json:"misc,omitempty"`
}

// Format formats response for returning to user
func (r *Resume) Format() ResumeResponse {
	var out ResumeResponse

	regexpMatch := func(keyname, text string) bool {
		r, err := regexp.Compile("(?i)^" + keyname + "$")
		if err != nil {
			log.Println(err)
		}
		return r.MatchString(text)
	}

	for _, summary := range r.Summary {
		for k, v := range summary {
			keyMatchesHeading := regexpMatch("summary", k)
			if r.Basics.Summary != "" {
				if keyMatchesHeading {
					out.Basics.Summary = out.Basics.Summary + "\n" + strings.TrimSpace(v.(string))
					continue
				}
				out.Basics.Summary = out.Basics.Summary + "\n" + strings.TrimSpace(k) + "\n" + strings.TrimSpace(v.(string))
			} else {
				if keyMatchesHeading {
					out.Basics.Summary = strings.TrimSpace(v.(string))
					continue
				}
				out.Basics.Summary = strings.TrimSpace(k) + "\n" + strings.TrimSpace(v.(string))
			}
		}
	}

	out.Basics.Title = r.Basics.Title
	out.Basics.Name = strings.TrimSpace(r.Basics.Name.FirstName + " " + r.Basics.Name.MiddleName + " " + r.Basics.Name.LastName)
	out.Basics.Summary = strings.TrimSpace(out.Basics.Summary)

	for _, v := range r.Basics.Email {
		if out.Basics.Email == "" {
			out.Basics.Email = v
		} else {
			out.Basics.Email = strings.TrimSpace(out.Basics.Email + "|" + v)
		}
	}

	for _, v := range r.Basics.Address {
		if out.Basics.Location.Address == "" {
			out.Basics.Location.Address = v
		} else {
			out.Basics.Location.Address = strings.TrimSpace(out.Basics.Location.Address + " | " + v)
		}
	}

	for _, v := range r.Basics.URL {
		if out.Basics.Website == "" {
			out.Basics.Website = v
		} else {
			out.Basics.Website = strings.TrimSpace(out.Basics.Website + "|" + v)
		}
	}

	for _, v := range r.Basics.Phone {
		if out.Basics.Phone == "" {
			out.Basics.Phone = v
		} else {
			out.Basics.Phone = strings.TrimSpace(out.Basics.Phone + "|" + v)
		}
	}

	for _, v := range r.WorkExperience {
		if !util.IsEmpty(v) {
			startDate := util.Parse(v.StartDate)
			endDate := util.Parse(v.EndDate)

			JavascriptISOString := "2006-01-02T15:04:05.999Z07:00"
			var s string
			var e string

			if len(startDate) != 0 {
				s = startDate[0].UTC().Format(JavascriptISOString)
			}

			if len(endDate) != 0 {
				e = endDate[0].UTC().Format(JavascriptISOString)
			}

			out.WorkExperience = append(out.WorkExperience, parsedWorkExperience{
				StartDate:  s,
				EndDate:    e,
				Position:   v.JobTitle,
				Company:    v.Organization,
				Summary:    v.Text,
				Highlights: []string{},
			})
		}
	}

	return out
}

// ResumeResponse holds fields we return to user
type ResumeResponse struct {
	Basics struct {
		Title    string `json:"jobTitle,omitempty"`
		Name     string `json:"name,omitempty"`
		Email    string `json:"email,omitempty"`
		Location struct {
			Address string `json:"address,omitempty"`
		} `json:"location,omitempty"`
		Website string `json:"url,omitempty"`
		Phone   string `json:"phone,omitempty"`
		Summary string `json:"summary,omitempty"`
	} `json:"basics,omitempty"`
	WorkExperience []parsedWorkExperience `json:"work"`
}

// ResumeParseResponse holds fields for parsed resume
type ResumeParseResponse struct {
	Resume ResumeResponse `json:"resume"`
	Key    string         `json:"key"`
}

type parsedWorkExperience struct {
	StartDate  string   `json:"startDate,omitempty"`
	Position   string   `json:"position,omitempty"`
	Company    string   `json:"company,omitempty"`
	EndDate    string   `json:"endDate,omitempty"`
	Summary    string   `json:"summary,omitempty"`
	Highlights []string `json:"highlights"`
}

// WorkExperience object
type WorkExperience struct {
	StartDate    string `json:"date_start,omitempty"`
	JobTitle     string `json:"jobtitle,omitempty"`
	Organization string `json:"organization,omitempty"`
	EndDate      string `json:"date_end,omitempty"`
	Text         string `json:"text,omitempty"`
}

// ResumeDownloadRequest holds fields for a resume download operation
type ResumeDownloadRequest struct {
	gorm.Model
	ExternalID string `json:"exttrid"  gorm:"type:varchar(100)"`
	ResumeID   uint   `json:"resume_id"  gorm:"type:int"`
	Paid       bool   `json:"paid"  gorm:"type:boolean"`
}
