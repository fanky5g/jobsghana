package types

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// TableUpdate holds dynamodb table configurations
type TableUpdate struct {
	AttributeDefinitions   []*dynamodb.AttributeDefinition
	GlobalSecondaryIndexes []*dynamodb.GlobalSecondaryIndexUpdate
	ProvisionedThroughput  *dynamodb.ProvisionedThroughput
}

// BatchGetItemInput holds keys and values for batchgetitem operation
// map[string]*dynamodb.KeysAndAttributes
type BatchGetItemInput struct {
	TableName string
	HashKey   string
	Keys      []string
	Item      interface{}
}
