package config

import (
	"errors"
	"fmt"
	"reflect"

	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/olebedev/config"
)

var confString = `
Port: 5000
AWSDefaultRegion: us-west-2
AWSAccessKeyID: 
AWSSecretKey: 
AWSToken:
BucketRegion: us-east-1
ImageBucketRegion: us-west-2
Bucket: xxxinafrica_store
ImageBucket: xxxcommunity-images
TemplateDir: server/data/templates
AppLogo: https://xxxinafrica.com/static/images/logo-web.png
AppURL: https://xxxinafrica.com
AppName: XXX Community
AppIcon: https://xxxinafrica.com/favicon.ico
DefaultAvatar: images/gravatar.png
Secret: Z29sZDU5
SMTPUser: support@xxxinafrica.com
SMTPPswd: 
SMTPHost: smtp.zoho.com
SMTPPort: 587
DBName: xxxinafrica
DBUser: dbadmin
DBPass: delta5000
SMTPAddr: support@xxxinafrica.com
FileDB: files
NumWorkers: 100
IPayMerchantKey: 
GoogleAPIKey: 
certFile: /etc/letsencrypt/live/xxxinafrica.com/cert.pem
keyFile: /etc/letsencrypt/live/xxxinafrica.com/privkey.pem
chainFile: /etc/letsencrypt/live/xxxinafrica.com/chain.pem
BleveIndexPath: /home/bleve/jobs.bleve
BleveProfilePath: /home/bleve/profile.bleve
ParserPath: /home/ResumeParser/ResumeTransducer
WURFLPath: web/server/wurfl.xml
`

// GetConfig returns Config
func GetConfig() (*types.Config, error) {
	conf, err := config.ParseYaml(confString)

	if err != nil {
		return nil, err
	}

	var cfg types.Config
	l := reflect.ValueOf(cfg).NumField()
	for i := 0; i < l; i++ {
		v := reflect.ValueOf(cfg)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()
			fieldname := t.Field(i).Name
			val := conf.UString(fieldname)
			setField(&cfg, fieldname, val)
		}
	}
	return &cfg, nil
}

// GetRawConfig returns default application configuration from confString
func GetRawConfig() (*config.Config, error) {
	return config.ParseYaml(confString)
}

func setField(obj interface{}, name string, value interface{}) error {
	structValue := reflect.ValueOf(obj).Elem()
	structFieldValue := structValue.FieldByName(name)

	if !structFieldValue.IsValid() {
		return fmt.Errorf("No such field: %s in obj", name)
	}

	if !structFieldValue.CanSet() {
		return fmt.Errorf("Cannot set %s field value", name)
	}

	structFieldType := structFieldValue.Type()
	val := reflect.ValueOf(value)
	if structFieldType != val.Type() {
		return errors.New("Provided value type didn't match obj field type")
	}

	structFieldValue.Set(val)
	return nil
}
