package handlers

// import (
// 	"github.com/fanky5g/xxxinafrica/web/server/config"
// 	"github.com/fanky5g/xxxinafrica/web/server/util"
// 	"bytes"
// 	"fmt"
// 	"github.com/stretchr/testify/assert"
// 	"io/ioutil"
// 	"mime/multipart"
// 	"net/http"
// 	"testing"
// )

// func TestCardTrans(t *testing.T) {
// 	cfg, _ := config.GetConfig()
// 	body := &bytes.Buffer{}
// 	wr := multipart.NewWriter(body)

// 	client := util.GetClient()

// 	exttrid := util.GenUniqueKey()

// 	fw, err := wr.CreateFormField("merchant_key")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte(cfg.IPayMerchantKey))
// 	assert.NoError(t, err)

// 	fw, err = wr.CreateFormField("total")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte(fmt.Sprintf("%.6f", 5.00)))
// 	assert.NoError(t, err)

// 	fw, err = wr.CreateFormField("invoice_id")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte(exttrid))
// 	assert.NoError(t, err)

// 	fw, err = wr.CreateFormField("ipn_url")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte("https://talentsinafrica.com/api/v1/resume/callback"))
// 	assert.NoError(t, err)

// 	fw, err = wr.CreateFormField("currency")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte("GHS"))
// 	assert.NoError(t, err)

// 	// @todo: change webview close method
// 	fw, err = wr.CreateFormField("success_url")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte("https://talentsinafrica.com/api/v1/resume/callback"))
// 	assert.NoError(t, err)

// 	fw, err = wr.CreateFormField("cancelled_url")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte("https://talentsinafrica.com/api/v1/resume/callback"))
// 	assert.NoError(t, err)

// 	fw, err = wr.CreateFormField("deferred_url")
// 	assert.NoError(t, err)

// 	_, err = fw.Write([]byte("https://talentsinafrica.com/api/v1/resume/callback"))
// 	assert.NoError(t, err)

// 	wr.Close()

// 	req, _ := http.NewRequest("POST", "https://community.ipaygh.com/gateway", body)
// 	req.Header.Set("Content-Type", wr.FormDataContentType())

// 	res, err := client.Do(req)
// 	assert.NoError(t, err)

// 	wr.Close()

// 	defer res.Body.Close()
// 	b, _ := ioutil.ReadAll(res.Body)
// 	t.Log(string(b))
// 	t.Log(res.StatusCode)
// }
