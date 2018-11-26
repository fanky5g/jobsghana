package database

import (
	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"reflect"
	"strings"
	// "time"
	// "os"
)

var (
	dynamo *dynamodb.DynamoDB
)

// CreateTable creates a new dynamodb table
func CreateTable(tableName, tableKey, rangeKey string, atd []*dynamodb.AttributeDefinition, gsi []*dynamodb.GlobalSecondaryIndex) error {
	svc, _ := getDynamodbInstance()
	if tableKey == "" {
		tableKey = "id"
	}

	if len(gsi) > 5 {
		gsi = gsi[:5] //gsi can only be maximum 5
	}

	in := &dynamodb.CreateTableInput{
		TableName:              aws.String(tableName),
		AttributeDefinitions:   atd,
		GlobalSecondaryIndexes: gsi,
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String(tableKey),
				KeyType:       aws.String("HASH"),
			},
		},
		ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	}

	_, err := svc.CreateTable(in)

	if err != nil && strings.Contains(err.Error(), dynamodb.ErrCodeResourceInUseException) {
		return fmt.Errorf("table already exists")
	}
	return err
}

func getDynamodbInstance() (*dynamodb.DynamoDB, error) {
	if dynamo != nil {
		return dynamo, nil
	}

	cfg, err := config.GetConfig()
	if err != nil {
		return nil, err
	}

	// isLocalDev := os.Getenv("TALENTSINAFRICA_LOCAL_DEV")

	// if isLocalDev != "" && isLocalDev == "true" {
	sess, err := config.GetAWSSession(cfg.AWSDefaultRegion, "http://dynamodb:8000")
	if err != nil {
		return nil, err
	}
	dynamo = dynamodb.New(sess)
	// } else {
	// 	sess, err := config.GetAWSSession(cfg.AWSDefaultRegion, fmt.Sprintf("dynamodb.%s.amazonaws.com", cfg.AWSDefaultRegion))
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	dynamo = dynamodb.New(sess)
	// }

	return dynamo, nil
}

// DeleteTable deletes dynamodb table
func DeleteTable(tableName string) error {
	svc, _ := getDynamodbInstance()
	din := &dynamodb.DeleteTableInput{
		TableName: aws.String(tableName),
	}
	_, err := svc.DeleteTable(din)
	return err
}

// InsertItem inserts item into dynamodb table
func InsertItem(table, itemKey string, item interface{}) error {
	f := func(it interface{}) error {
		iv, err := dynamodbattribute.MarshalMap(it)
		if err != nil {
			return fmt.Errorf("item marshalling failed")
		}

		svc, _ := getDynamodbInstance()
		_, err = svc.PutItem(&dynamodb.PutItemInput{
			TableName: aws.String(table),
			Item:      iv,
		})
		return err
	}

	err := f(item)
	if err != nil && strings.Contains(err.Error(), dynamodb.ErrCodeResourceNotFoundException) {
		// lambda only has a short window, so we do not have time to create table and insert
		return fmt.Errorf("table does not exist")
		// CreateTable(table, itemKey)
		// var e error
		// for e = f(item); e != nil && strings.Contains(e.Error(), dynamodb.ErrCodeResourceInUseException); {
		// 	time.Sleep(time.Second * 5) //continue sleeping till table finish creating and we can insert
		// }
		// err = e
	}

	return err
}

// UpdateItem edits an existing dynamodb item
func UpdateItem(tableName, tableKey, keyValue string, item interface{}) (interface{}, error) {
	in := &dynamodb.UpdateItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			tableKey: &dynamodb.AttributeValue{
				S: aws.String(keyValue),
			},
		},
		ExpressionAttributeNames:  genExpressionAttributeNames(item),
		ExpressionAttributeValues: genExpressionAttributeValues(item),
		UpdateExpression:          genUpdateExpression(item),
		ReturnValues:              aws.String("ALL_NEW"),
	}

	svc, _ := getDynamodbInstance()
	o, err := svc.UpdateItem(in)

	t := reflect.ValueOf(item)
	typ := t.Type()
	out := (reflect.New(typ)).Interface()

	dynamodbattribute.UnmarshalMap(o.Attributes, &out)

	return out, err
}

func genExpressionAttributeNames(item interface{}) map[string]*string {
	out := make(map[string]*string)

	v := reflect.ValueOf(item)

	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	l := v.NumField()

	for i := 0; i < l; i++ {
		k := v.Field(i).Kind()

		t := v.Type()
		isEmpty := util.IsEmpty(v.Field(i).Interface())
		if k == reflect.Map {
			isEmpty = v.Field(i).Len() == 0
		}

		if k == reflect.Ptr {
			isEmpty = v.Field(i).IsNil()
		}

		if k == reflect.Bool {
			isEmpty = v.Field(i).Interface() == false
		}

		if k == reflect.Slice {
			isEmpty = v.Field(i).Len() == 0
		}

		// redact float empty for now
		if k == reflect.Float64 || k == reflect.Float32 {
			isEmpty = v.Field(i).Float() == 0
		}

		var isKey bool
		key, _ := t.Field(i).Tag.Lookup("key")
		if key != "" && key == "true" {
			isKey = true
		}

		var shouldSkipAttName bool
		skipAttName, _ := t.Field(i).Tag.Lookup("skipAttName")
		if skipAttName != "" && skipAttName == "true" {
			shouldSkipAttName = true
		}

		if !isEmpty && !isKey && !shouldSkipAttName {
			fieldname := t.Field(i).Name
			r, _ := t.Field(i).Tag.Lookup("json")
			if r != "" {
				fieldname = strings.Split(r, ",")[0]
			}
			out[fmt.Sprintf("#%s", strings.ToLower(fieldname))] = aws.String(fieldname)
		}
	}
	return out
}

func getKey(item interface{}) string {
	keyVal := "id"

	v := reflect.ValueOf(item)

	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	l := v.NumField()

	for i := 0; i < l; i++ {
		k := v.Field(i).Kind()

		t := v.Type()
		isEmpty := util.IsEmpty(v.Field(i).Interface())

		if k == reflect.Map {
			isEmpty = v.Field(i).Len() == 0
		}

		if k == reflect.Ptr {
			isEmpty = v.Field(i).IsNil()
		}

		if k == reflect.Bool {
			isEmpty = v.Field(i).Interface() == false
		}

		if k == reflect.Float64 || k == reflect.Float32 {
			isEmpty = v.Field(i).Float() == 0
		}

		if isEmpty {
			continue
		}

		var isKey bool
		key, _ := t.Field(i).Tag.Lookup("key")
		if key != "" && key == "true" {
			isKey = true
		}

		if isKey {
			r, _ := t.Field(i).Tag.Lookup("json")
			if r != "" {
				keyVal = strings.Split(r, ",")[0]
			}
			break
		}
	}

	return keyVal
}

func genExpressionAttributeValues(item interface{}) map[string]*dynamodb.AttributeValue {
	out := make(map[string]*dynamodb.AttributeValue)
	marshalled, _ := dynamodbattribute.MarshalMap(item)

	for k, v := range marshalled {
		isNull := (v.NULL != nil && *v.NULL == true) || (v.BOOL != nil && *v.BOOL == false) || (v.N != nil && *v.N == "0")

		// write function to get key from model
		isKey := k == getKey(item)

		if !isNull && !isKey {
			out[fmt.Sprintf(":%s", k)] = v
		}
	}
	return out
}

func genUpdateExpression(item interface{}) *string {
	var out string

	v := reflect.ValueOf(item)

	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	l := v.NumField()

	for i := 0; i < l; i++ {
		k := v.Field(i).Kind()

		t := v.Type()
		isEmpty := util.IsEmpty(v.Field(i).Interface())
		if k == reflect.Map {
			isEmpty = v.Field(i).Len() == 0
		}

		if k == reflect.Bool {
			isEmpty = v.Field(i).Interface() == false
		}

		if k == reflect.Ptr {
			isEmpty = v.Field(i).IsNil()
		}

		if k == reflect.Slice {
			isEmpty = v.Field(i).Len() == 0
		}

		var isKey bool
		key, _ := t.Field(i).Tag.Lookup("key")
		if key != "" && key == "true" {
			isKey = true
		}

		// redact float empty for now
		if k == reflect.Float64 || k == reflect.Float32 {
			isEmpty = v.Field(i).Float() == 0
		}

		if !isEmpty && !isKey {
			fieldname := t.Field(i).Name
			r, _ := t.Field(i).Tag.Lookup("json")
			if r != "" {
				fieldname = strings.Split(r, ",")[0]
			}
			if out == "" {
				out = fmt.Sprintf("SET #%s = :%s", fieldname, fieldname)
			} else {
				out = fmt.Sprintf("%s, #%s = :%s", out, fieldname, fieldname)
			}
		}

	}
	return aws.String(out)
}

// DeleteItem deletes dynamodb item
func DeleteItem(tableName, hashKey, hashValue string) error {
	in := &dynamodb.DeleteItemInput{
		TableName: aws.String(tableName),

		Key: map[string]*dynamodb.AttributeValue{
			hashKey: &dynamodb.AttributeValue{
				S: aws.String(hashValue),
			},
		},
		ReturnValues: aws.String("ALL_OLD"),
	}

	svc, _ := getDynamodbInstance()
	_, err := svc.DeleteItem(in)
	return err
}

// UpdateTable updates a dynamodb table
func UpdateTable(tableName string, update types.TableUpdate) error {
	var in *dynamodb.UpdateTableInput
	if update.ProvisionedThroughput != nil {
		in = &dynamodb.UpdateTableInput{
			ProvisionedThroughput: update.ProvisionedThroughput,
			AttributeDefinitions:  update.AttributeDefinitions,
		}
	} else if update.GlobalSecondaryIndexes != nil {
		in = &dynamodb.UpdateTableInput{
			GlobalSecondaryIndexUpdates: update.GlobalSecondaryIndexes,
			AttributeDefinitions:        update.AttributeDefinitions,
		}
	}

	in.TableName = aws.String(tableName)

	svc, _ := getDynamodbInstance()
	_, err := svc.UpdateTable(in)
	return err
}

// GetItemByKey gets an item from dynamodb table by key
func GetItemByKey(tableName, hashKey, hashValue, projectionExpression string, item interface{}) (interface{}, error) {
	in := &dynamodb.GetItemInput{
		TableName:      aws.String(tableName),
		ConsistentRead: aws.Bool(true),
		Key: map[string]*dynamodb.AttributeValue{
			hashKey: {
				S: aws.String(hashValue),
			},
		},
	}

	if projectionExpression != "" {
		in.ProjectionExpression = aws.String(projectionExpression)
	}

	svc, _ := getDynamodbInstance()
	o, err := svc.GetItem(in)
	if err != nil {
		return nil, err
	}

	t := reflect.ValueOf(item)
	typ := t.Type()
	out := (reflect.New(typ)).Interface()

	dynamodbattribute.UnmarshalMap(o.Item, &out)
	return out, nil
}

// GetItem gets an item from dynamodb table by global secondary index
func GetItem(tableName, indexName, matchKey, match string, item interface{}) ([]interface{}, error) {
	nKey := fmt.Sprintf(":v_%s", matchKey)
	in := &dynamodb.QueryInput{
		TableName:              aws.String(tableName),
		IndexName:              aws.String(indexName),
		KeyConditionExpression: aws.String(fmt.Sprintf("#%s = %s", matchKey, nKey)),
		ExpressionAttributeNames: map[string]*string{
			fmt.Sprintf("#%s", matchKey): aws.String(matchKey),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			nKey: &dynamodb.AttributeValue{
				S: aws.String(match),
			},
		},
	}

	svc, _ := getDynamodbInstance()
	o, err := svc.Query(in)
	if err != nil {
		return nil, err
	}

	var outArray []interface{}

	for _, v := range o.Items {
		t := reflect.ValueOf(item)
		typ := t.Type()
		out := (reflect.New(typ)).Interface()
		dynamodbattribute.UnmarshalMap(v, &out)
		outArray = append(outArray, out)
	}

	return outArray, nil
}

// BatchGetItem gets multiple items based on key specified
func BatchGetItem(input []types.BatchGetItemInput) (map[string][]interface{}, error) {
	in := make(map[string]*dynamodb.KeysAndAttributes)
	for _, inputItem := range input {
		tableName := inputItem.TableName
		hashKey := inputItem.HashKey
		var keysToFind []map[string]*dynamodb.AttributeValue
		for _, key := range inputItem.Keys {
			keysToFind = append(keysToFind, map[string]*dynamodb.AttributeValue{
				hashKey: {
					S: aws.String(key),
				}},
			)
		}
		keysAndAttributes := &dynamodb.KeysAndAttributes{
			Keys: keysToFind,
		}
		in[tableName] = keysAndAttributes
	}

	svc, _ := getDynamodbInstance()
	result, err := svc.BatchGetItem(&dynamodb.BatchGetItemInput{
		RequestItems: in,
	})

	if err != nil {
		return nil, err
	}

	outArray := make(map[string][]interface{})
	var item interface{}

	for table, foundItems := range result.Responses {
		// find item interface
		for _, v := range input {
			if v.TableName == table {
				item = v.Item
			}
		}

		for _, v := range foundItems {
			t := reflect.ValueOf(item)
			typ := t.Type()
			out := (reflect.New(typ)).Interface()
			dynamodbattribute.UnmarshalMap(v, &out)
			outArray[table] = append(outArray[table], out)
		}
	}

	return outArray, nil
}

// GetItemWithFilter gets an item from dynamodb using filter expression specified
func GetItemWithFilter(
	tableName,
	indexName,
	matchKey,
	match,
	filter string,
	lookup interface{},
	item interface{}) ([]interface{}, error) {
	nKey := fmt.Sprintf(":v_%s", matchKey)

	attrNames := genExpressionAttributeNames(lookup)
	attrValues := genExpressionAttributeValues(lookup)

	attrNames[fmt.Sprintf("#%s", matchKey)] = aws.String(matchKey)
	attrValues[nKey] = &dynamodb.AttributeValue{
		S: aws.String(match),
	}

	in := &dynamodb.QueryInput{
		TableName:                 aws.String(tableName),
		IndexName:                 aws.String(indexName),
		KeyConditionExpression:    aws.String(fmt.Sprintf("#%s = %s", matchKey, nKey)),
		ExpressionAttributeNames:  attrNames,
		ExpressionAttributeValues: attrValues,
	}

	if filter != "" {
		in.FilterExpression = aws.String(filter)
	}

	svc, _ := getDynamodbInstance()
	o, err := svc.Query(in)
	if err != nil {
		return nil, err
	}

	var outArray []interface{}

	for _, v := range o.Items {
		t := reflect.ValueOf(item)
		typ := t.Type()
		out := (reflect.New(typ)).Interface()
		dynamodbattribute.UnmarshalMap(v, &out)
		outArray = append(outArray, out)
	}

	return outArray, nil
}

// GetItemFilterWithPaginate gets an item from dynamodb using filter expression specified
// and returns LastEvaluatedKey and done values
func GetItemFilterWithPaginate(
	tableName,
	indexName,
	matchKey,
	match,
	filter string,
	lookup interface{},
	lastEvaluatedKey interface{},
	limit int64,
	item interface{}) ([]interface{}, interface{}, bool, error) {
	nKey := fmt.Sprintf(":v_%s", matchKey)

	VLastEvaluatedKey := make(map[string]*dynamodb.AttributeValue)

	if reflect.TypeOf(lastEvaluatedKey) != reflect.TypeOf(VLastEvaluatedKey) {
		v, err := dynamodbattribute.MarshalMap(lastEvaluatedKey)
		if err != nil {
			return nil, nil, false, err
		}
		VLastEvaluatedKey = v
	} else {
		VLastEvaluatedKey = lastEvaluatedKey.(map[string]*dynamodb.AttributeValue)
	}

	attrNames := genExpressionAttributeNames(lookup)
	attrValues := genExpressionAttributeValues(lookup)

	attrNames[fmt.Sprintf("#%s", matchKey)] = aws.String(matchKey)
	attrValues[nKey] = &dynamodb.AttributeValue{
		S: aws.String(match),
	}

	in := &dynamodb.QueryInput{
		TableName:                 aws.String(tableName),
		IndexName:                 aws.String(indexName),
		KeyConditionExpression:    aws.String(fmt.Sprintf("#%s = %s", matchKey, nKey)),
		ExpressionAttributeNames:  attrNames,
		ExpressionAttributeValues: attrValues,
		ScanIndexForward:          aws.Bool(false),
		Limit:                     aws.Int64(limit),
	}

	if len(VLastEvaluatedKey) != 0 {
		in.ExclusiveStartKey = VLastEvaluatedKey
	}

	if filter != "" {
		in.FilterExpression = aws.String(filter)
	}

	svc, _ := getDynamodbInstance()
	o, err := svc.Query(in)
	if err != nil {
		return nil, nil, false, err
	}

	var oLastEvaluatedKey interface{}
	var done bool

	if len(o.LastEvaluatedKey) != 0 {
		t := reflect.ValueOf(item)
		typ := t.Type()
		oLastEvaluatedKey = (reflect.New(typ)).Interface()
		dynamodbattribute.UnmarshalMap(o.LastEvaluatedKey, &oLastEvaluatedKey)
	} else {
		done = true
	}

	var outArray []interface{}

	for _, v := range o.Items {
		t := reflect.ValueOf(item)
		typ := t.Type()
		out := (reflect.New(typ)).Interface()
		dynamodbattribute.UnmarshalMap(v, &out)
		outArray = append(outArray, out)
	}

	return outArray, oLastEvaluatedKey, done, nil
}

// CreateTableFromModel creates a dynamodb table
func CreateTableFromModel(model interface{}, tableName string, hashKey string) error {
	var AttributeDefinitions []*dynamodb.AttributeDefinition
	var GlobalSecondaryIndexes []*dynamodb.GlobalSecondaryIndex
	var rangeString string

	l := reflect.ValueOf(model).NumField()

	for i := 0; i < l; i++ {
		v := reflect.ValueOf(model)
		k := v.Field(i).Kind()

		if k != reflect.Ptr {
			t := v.Type()

			fieldname := t.Field(i).Name
			r, _ := t.Field(i).Tag.Lookup("json")
			u, _ := t.Field(i).Tag.Lookup("unique")
			rangeKey, _ := t.Field(i).Tag.Lookup("sort")
			if r != "" {
				fieldname = strings.Split(r, ",")[0]
			}

			if rangeKey != "" && rangeKey == "true" {
				rangeString = rangeKey
			}

			if u != "" && u == "true" {
				// add attribute definition
				definition := &dynamodb.AttributeDefinition{
					AttributeName: aws.String(fieldname),
					AttributeType: aws.String("S"),
				}

				AttributeDefinitions = append(AttributeDefinitions, definition)

				// build global secondary index
				indexName := fmt.Sprintf("%sIndex", strings.Title(fieldname))
				gsi := &dynamodb.GlobalSecondaryIndex{
					IndexName: aws.String(indexName),
					KeySchema: []*dynamodb.KeySchemaElement{
						&dynamodb.KeySchemaElement{
							AttributeName: aws.String(fieldname),
							KeyType:       aws.String("HASH"),
						},
					},
					Projection: &dynamodb.Projection{
						ProjectionType: aws.String("ALL"),
					},
					ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
						ReadCapacityUnits:  aws.Int64(2),
						WriteCapacityUnits: aws.Int64(2),
					},
				}

				GlobalSecondaryIndexes = append(GlobalSecondaryIndexes, gsi)
			}
		}
	}

	indexDefinition := &dynamodb.AttributeDefinition{
		AttributeName: aws.String(hashKey),
		AttributeType: aws.String("S"),
	}

	AttributeDefinitions = append(AttributeDefinitions, indexDefinition)

	return CreateTable(tableName, hashKey, rangeString, AttributeDefinitions, GlobalSecondaryIndexes)
}
