package upload

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"bufio"
	"bytes"
	"fmt"
	"github.com/rubenfonseca/fastimage"
	"io"
	"log"
	"os"
	"path/filepath"
	"testing"
)

var Agent *S3Agent
var tempBucket = util.TempName("Bucket", 8)
var tempFileKey string

func init() {
	cfg, _ := GetConfig("../../.env")
	a, err := CreateClient(cfg, tempBucket, "files")
	if err != nil {
		log.Fatal(err)
	}
	Agent = a
}

func TestCreateS3Bucket(t *testing.T) {
	_, err := Agent.CreateS3Bucket("")

	if err != ErrBucketEmpty {
		t.Error(err)
	}

	bucketInfo, err := Agent.CreateS3Bucket(tempBucket)

	if err != nil {
		t.Errorf("Bucket creation failed %s", err)
	}

	if bucketInfo.Location == nil {
		t.Errorf("Bucket creation failed, location empty")
	}
}

func upfile() (types.FileMetadata, error) {
	tempFileKey = "preview.png"
	fp, err := filepath.Abs(fmt.Sprintf("../data/static/testdata/%s", tempFileKey))

	if err != nil {
		return types.FileMetadata{}, err
	}

	file, err := os.Open(fp)
	if err != nil {
		return types.FileMetadata{}, err
	}

	defer file.Close()

	out, err := Agent.Upload(file, tempFileKey)
	tempFileKey = out.Key

	return out, err

}

func TestUploadFile(t *testing.T) {
	out, err := upfile()

	if err != nil {
		t.Errorf("Upload failed %s", err)
	}

	if out.ImageType != "PNG" {
		t.Errorf("Expected imagetype to be %s but got %s", fastimage.JPEG, out.ImageType)
	}

	if out.Width == 0 {
		t.Error("Expected width to not be 0")
	}
}

func TestGetFile(t *testing.T) {
	r, length, err := Agent.GetFile(tempBucket, tempFileKey)

	if err != nil {
		t.Errorf("GetFile returned an error %s", err)
	}

	defer r.Close()

	var b bytes.Buffer
	writer := bufio.NewWriter(&b)
	bytesWritten, err := io.Copy(writer, r)
	// writer.Flush()

	if err != nil {
		t.Error(err)
	}

	if bytesWritten != length {
		t.Errorf("Expected content length to equal %d but got %d", length, bytesWritten)
	}
}

func TestGetSignedURL(t *testing.T) {

	_, err := Agent.GetSignedURL(tempBucket, "")

	if err != ErrKeyEmpty {
		t.Error(err)
	}

	_, err = Agent.GetSignedURL("", tempFileKey)

	if err != ErrBucketEmpty {
		t.Error(err)
	}

	out, err := Agent.GetSignedURL(tempBucket, tempFileKey)

	if err != nil {
		t.Errorf("GetSignedURL failed with error %s", err)
	}

	if out == nil {
		t.Errorf("Expected signed url but got %s", out)
	}
}

func TestDeleteFile(t *testing.T) {
	deleted, err := Agent.DeleteFile(tempBucket, tempFileKey)
	if err != nil {
		t.Error(err)
	}

	if deleted != true {
		t.Errorf("Expected deleted to equal true but got %d", deleted)
	}
}

func TestEmptyS3Bucket(t *testing.T) {
	// reupload file
	_, err := upfile()

	if err != nil {
		t.Fatal(err)
	}

	_, err = Agent.EmptyBucket("")

	if err != ErrBucketEmpty {
		t.Error(err)
	}

	out, err := Agent.EmptyBucket(tempBucket)

	if err != nil {
		t.Errorf("Empty bucket operation failed with error %s", err)
	}

	if len(out.Errors) != 0 {
		for _, e := range out.Errors {
			t.Error(e)
		}
	}

	if len(out.Deleted) != 1 {
		t.Errorf("Expected deleted object length to equal 1 but got %d", len(out.Deleted))
	}
}

func TestDeleteS3Bucket(t *testing.T) {
	_, err := Agent.DeleteS3Bucket(tempBucket)

	if err != nil {
		t.Error("Bucket delete failed %s", err)
	}
}
