package database

import (
	// "github.com/fanky5g/xxxinafrica/web/server/types"
	// "fmt"
	// "github.com/fatih/structs"
	"github.com/stretchr/testify/assert"
	"testing"
)

// func TestGetItemsFilterWithPaginate(t *testing.T) {
// 	var lEvaluated interface{}
// 	more := true

// 	for more {
// 		items, lastEvaluatedKey, d, err := GetItemFilterWithPaginate("Transactions", "ReferenceIndex", "reference", "SEND_AIRTIME", "", struct{}{}, lEvaluated, 2, types.Transaction{})
// 		assert.NoError(t, err)
// 		for _, item := range items {
// 			t.Log(item.(*types.Transaction))
// 		}

// 		if lastEvaluatedKey != nil {
// 			lEvaluated = lastEvaluatedKey.(*types.Transaction)
// 		}
// 		if d == true {
// 			more = false
// 		}
// 	}
// 	t.Log("done listing all transactions")
// }

func TestDeleteIndex(t *testing.T) {
	// index, err := GetBleveUserIndex()
	// assert.NoError(t, err)
	// err = index.Delete("Software Engineer")
	// assert.NoError(t, err)
	results, err := SuggestProfile("software")
	assert.NoError(t, err)
	assert.NotEmpty(t, results)
	for _, result := range results.Hits {
		t.Log(result.ID)
		t.Log(result.Fields)
	}
}
