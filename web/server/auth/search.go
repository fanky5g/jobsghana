package auth

import (
	"fmt"
	"strings"

	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

// SearchProfile searches for job profiles and returns them
func SearchProfile(query, location string) ([]map[string]interface{}, error) {
	var found []map[string]interface{}

	userSearchResults, err := database.SearchProfileWithIndex(query, location)
	if err != nil {
		return found, err
	}

	db := database.GetMySQLInstance()
	defer db.Close()

	//@todo:only send uid, calculated work experience, jobSector, location, salaryExpectation, jobType, level
	for _, v := range userSearchResults.Hits {
		var user types.User
		index := v.Fields["id"].(float64)
		err = db.First(&user, uint(index)).Error
		if err != nil && err.Error() != "record not found" {
			return found, err
		}

		if err != nil && err.Error() == "record not found" {
			return found, nil
		}

		if user.Profile.Preferences.JobSector != "" {
			// @todo:experience := calculateWorkExperience(user.Profile.WorkExperience) - Feeling lazy, send work experience object trimmed to just time to web view and use already written function there
			// also send at most 3 skills of user to client so we can show to employers

			var userWorkRanges []string
			var userSkills []types.Skill

			for _, experience := range user.Profile.WorkExperience {
				// if i get less lazy and come back to this, we can just calculate the timerange between every work object and add them up
				userWorkRanges = append(userWorkRanges, experience.StartDate, experience.EndDate)
			}

			if len(user.Profile.Skills) > 2 {
				userSkills = user.Profile.Skills[:2]
			} else {
				userSkills = user.Profile.Skills
			}

			JavascriptISOString := "2006-01-02T15:04:05.999Z07:00"

			found = append(found, map[string]interface{}{
				"uid":               index,
				"jobSector":         v.Fields["jobSector"].(string),
				"jobTitle":          v.Fields["jobTitle"].(string),
				"level":             v.Fields["level"].(string),
				"location":          v.Fields["location"].(string),
				"pref_loc":          v.Fields["pref_loc"].(string),
				"salaryExpectation": v.Fields["salaryExpectation"].(string),
				"jobType":           v.Fields["jobType"].(string),
				"skills":            userSkills,
				"work_timerange":    userWorkRanges,
				"last_updated":      user.UpdatedAt.Format(JavascriptISOString),
				"resume":            cleanProfileForPreviw(user.Profile), //just in case we need to build a preview
			})
		}
	}

	return found, nil
}

func cleanProfileForPreviw(profile types.JobProfile) map[string]interface{} {
	out := make(map[string]interface{})

	out["jobTitle"] = profile.Basics.JobTitle
	out["location"] = profile.Basics.Location

	var workExperience []map[string]interface{}
	var education []map[string]interface{}
	var skills []string

	var workBoundary = 2

	if len(profile.WorkExperience) < 2 {
		workBoundary = len(profile.WorkExperience)
	}

	for _, work := range profile.WorkExperience[:workBoundary] {
		if work.Role != "" && work.Company != "" && len(work.Duties) > 0 {
			workExperience = append(workExperience, map[string]interface{}{
				"role":    work.Role,
				"company": work.Company,
				"start":   work.StartDate,
				"end":     work.EndDate,
				"roles":   "&#8226; " + strings.TrimSuffix(strings.Join(work.Duties, " &#8226; "), "&#8226;"),
			})
		}
	}

	out["workExperience"] = workExperience
	var educationBoundary = 3

	if len(profile.Education) < 3 {
		educationBoundary = len(profile.Education)
	}

	for _, school := range profile.Education[:educationBoundary] {
		if school.Qualification != "" && school.Institution != "" {
			education = append(education, map[string]interface{}{
				"qualification": school.Qualification,
				"institution":   school.Institution,
				"completed":     school.EndDate,
			})
		}
	}

	out["education"] = education

	for _, skill := range profile.Skills {
		skills = append(skills, fmt.Sprintf("%s (%s)", skill.Name, skill.Level))
	}
	out["skills"] = skills
	out["personalStatement"] = profile.Basics.PersonalStatement

	return out
}

// GetProfileSuggestions gets suggestions for job searches
// func GetProfileSuggestions(query string) ([]string, error) {
// 	var suggestions []string

// 	searchResult, err := database.SuggestProfile(query)
// 	if err != nil {
// 		return suggestions, err
// 	}

// 	for _, v := range searchResult.Hits {
// 		suggestions = append(suggestions, v.Fields["jobTitle"].(string))
// 	}

// 	return suggestions, nil
// }
