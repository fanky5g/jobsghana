package indexer

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

// IndexJobs indexes all jobs supplied
func IndexJobs(jobs []types.Job) error {
	bleveIndex, err := database.GetBleveIndex()
	if err != nil {
		return err
	}

	for _, job := range jobs {
		// if job.Region == "" {
		// 	job.Region = database.EmptyIndex
		// }

		err = bleveIndex.Index(job.Description, job)
		if err != nil {
			return err
		}
	}

	return nil
}
