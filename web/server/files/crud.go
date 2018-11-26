package files

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

const fileCol = "files"

// SaveFile saves an uploaded file record into database
func SaveFile(file *types.FileMetadata) (err error) {
	db := database.GetMySQLInstance()
	defer db.Close()

	return db.Create(file).Error
}

// EditFile modifies a saved file meta
func EditFile(file *types.FileMetadata, updates map[string]interface{}) error {
	db := database.GetMySQLInstance()
	defer db.Close()

	return db.Model(file).Updates(updates).Error
}

// Delete deletes a file from amazon aws s3
func Delete(file *types.FileMetadata) error {
	return nil
}

// DeleteMultiple deletes multiple files from s3 bucket
func DeleteMultiple(files []types.FileMetadata) error {
	return nil
}
