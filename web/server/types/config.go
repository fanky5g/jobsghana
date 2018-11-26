package types

// Config holds application environment variables
type Config struct {
	AWSDefaultRegion  string
	AWSAccessKeyID    string
	AWSSecretKey      string
	AWSToken          string
	BucketRegion      string
	Bucket            string
	ImageBucket       string
	ImageBucketRegion string
	DefaultAvatar     string
	Secret            string
	AppLogo           string
	AppURL            string
	AppIcon           string
	AppName           string
	FileDB            string
	NumWorkers        string
	BleveIndexPath    string
	BleveProfilePath  string
	ParserPath        string
	DBName            string
	DBUser            string
	DBPass            string
	IPayMerchantKey   string
	IpayEndpoint1     string
	IpayEndpoint2     string
	WURFLPath         string
}
