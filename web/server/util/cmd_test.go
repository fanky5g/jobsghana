package util

// import (
// 	"github.com/fanky5g/xxxinafrica/web/server/config"
// 	"fmt"
// 	"github.com/stretchr/testify/assert"
// 	"sync"
// 	"testing"
// )

// func TestExecuteCommand(t *testing.T) {
// 	var wg sync.WaitGroup
// 	cfg, _ := config.GetConfig()
// 	parserPath := cfg.ParserPath
// 	wg.Add(1)
// 	out, err := ExecuteCommand(fmt.Sprintf(`(cd %s && java -cp 'bin/*:../GATEFiles/lib/*:../GATEFiles/bin/gate.jar:lib/*' code4goal.antony.resumeparser.ResumeParserProgram /home/breezy/Projects/ResumeParser/ResumeTransducer/UnitTests/AntonyDeepakThomas.pdf /home/breezy/Desktop/out.json)`, parserPath), &wg)
// 	wg.Wait()
// 	assert.NoError(t, err)
// 	t.Log(out)
// }
