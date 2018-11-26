package files

import (
	"github.com/fanky5g/xxxinafrica/web/server/image"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"strings"
)

// FormatFile returns file Metadata
func FormatFile(file *types.File) types.FileMetadata {
	// name := util.GetFileName(file.Key)
	mimetype := util.GetMimeType(file.Key)

	out := types.FileMetadata{
		FileName: file.FileName,
		Key:      file.Key,
		MimeType: mimetype,
		Bucket:   file.Bucket,
		URL:      file.Location,
		FileSize: file.Size,
		AuthorID: file.AuthorID,
	}

	if strings.Contains(out.MimeType, "image") {
		imagetype, width, height, err := image.GetImageMeta(out.URL)
		// Do nothing for failed requests
		if err == nil {
			out.Width = width
			out.Height = height
			out.ImageType = imagetype
		}
	}

	return out
}
