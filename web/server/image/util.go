package image

import "github.com/rubenfonseca/fastimage"

// GetImageMeta returns information about image
func GetImageMeta(url string) (string, uint32, uint32, error) {
	imagetype, size, err := fastimage.DetectImageType(url)
	if err != nil {
		return "", uint32(0), uint32(0), err
	}

	var itype string

	switch imagetype {
	case fastimage.JPEG:
		itype = "JPEG"
	case fastimage.PNG:
		itype = "PNG"
	case fastimage.GIF:
		itype = "GIF"
	}

	if size != nil {
		return itype, size.Width, size.Height, nil
	}

	return itype, uint32(800), uint32(600), nil
}
