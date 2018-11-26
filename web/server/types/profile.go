package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// JobProfile represents user's json schema representation of resume
type JobProfile struct {
	Basics         Profile     `json:"basics,omitempty"`
	Preferences    Preferences `json:"preferences"`
	WorkExperience []work      `json:"work,omitempty"`
	Education      []education `json:"education,omitempty"`
	Competencies   []string    `json:"competencies,omitempty"`
	Skills         []Skill     `json:"skills,omitempty"`
	Awards         []award     `json:"award,omitempty"`
	Certifications []string    `json:"certifications,omitempty"`
	Referees       referees    `json:"referees,omitempty"`
	Meta           Meta        `json:"meta,omitempty"`
}

// Profile represents user's basic account information
type Profile struct {
	Name              string `json:"name,omitempty"`
	DateOfBirth       string `json:"dob,omitempty"`
	Address           string `json:"address,omitempty"`
	Email             string `json:"email,omitempty"`
	Phone             string `json:"phone,omitempty"`
	Location          string `json:"location,omitempty"`
	PersonalStatement string `json:"personalStatement,omitempty"`
	JobTitle          string `json:"jobTitle,omitempty"`
}

// Preferences holds fields for user job preferences
type Preferences struct {
	JobSector         string `json:"jobSector,omitempty"`
	JobSectorAlt      string `json:"jobSectorAlt,omitempty"`
	Level             string `json:"level,omitempty"`
	SalaryExpectation string `json:"salaryExpectation,omitempty"`
	Location          string `json:"location,omitempty"`
	JobType           string `json:"jobType,omitempty"`
}

type work struct {
	StartDate string   `json:"startDate,omitempty"`
	Role      string   `json:"role,omitempty"`
	Company   string   `json:"company,omitempty"`
	EndDate   string   `json:"endDate,omitempty"`
	Duties    []string `json:"duties,omitempty"`
}

type education struct {
	Institution   string `json:"institution,omitempty"`
	Qualification string `json:"qualification,omitempty"`
	StartDate     string `json:"startDate,omitempty"`
	EndDate       string `json:"endDate,omitempty"`
}

type award struct {
	Title string `json:"title,omitempty"`
	Year  string `json:"year,omitempty"`
}

// Skill dummy doc
type Skill struct {
	Name  string `json:"name,omitempty"`
	Level string `json:"level,omitempty"`
}

type referees struct {
	Employment struct {
		Name      string `json:"name"`
		Position  string `json:"position"`
		Company   string `json:"company"`
		Telephone string `json:"telephone"`
	} `json:"employment"`
	Character struct {
		Name      string `json:"name"`
		Position  string `json:"position"`
		Telephone string `json:"telephone"`
	} `json:"character"`
	Academic struct {
		Name        string `json:"name"`
		Position    string `json:"position"`
		Institution string `json:"institution"`
		Telephone   string `json:"telephone"`
	} `json:"academic"`
}

// Value dummy doc
func (a JobProfile) Value() (driver.Value, error) {
	j, err := json.Marshal(a)
	return j, err
}

// Scan dummy doc
func (a *JobProfile) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("Type assertion .([]byte) failed")
	}

	err := json.Unmarshal(source, a)
	if err != nil {
		return errors.New("JobProfile unmarshal failed " + err.Error())
	}

	return nil
}
