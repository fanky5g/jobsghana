package main

import (
	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	crand "crypto/rand"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/eventloop"
	"github.com/fatih/structs"
	"github.com/labstack/echo"
	"github.com/nu7hatch/gouuid"
	"github.com/olebedev/gojax/fetch"
	"html/template"
	"math/rand"
	"net/http"
	"runtime"
	"strings"
	"time"
)

// React struct is contains JS vms
// pool to serve HTTP requests and
// separates some domain specific
// resources.
type React struct {
	pool
	debug bool
	path  string
}

// NewReact initialized React struct
func NewReact(filePath string, debug bool, proxy http.Handler) *React {
	r := &React{
		debug: debug,
		path:  filePath,
	}
	if !debug {
		r.pool = newEnginePool(filePath, runtime.NumCPU(), proxy)
	} else {
		// Use onDemandPool to load full react
		// app each time for any http requests.
		// Useful to debug the app.
		r.pool = &onDemandPool{
			path:  filePath,
			proxy: proxy,
		}
	}
	return r
}

// CheckIsMobile checks if client is using a mobile phone. Replace this later with a more robust solution later
func CheckIsMobile(useragent string) bool {
	mobiles := []string{"Android", "webOS", "iPhone", "iPad", "BlackBerry", "IEMobile"}
	for _, device := range mobiles {
		if strings.Index(useragent, device) > -1 {
			return true
		}
	}
	return false
}

// Handle handles all HTTP requests which
// have not been caught via static file
// handler or other middlewares.
func (r *React) Handle(c echo.Context, templatePath string) error {
	UUID := c.Get("uuid").(*uuid.UUID)
	defer func() {
		if r := recover(); r != nil {
			c.Response().Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			c.Response().Header().Set("Pragma", "no-cache")
			c.Response().Header().Set("Expires", "0")

			c.Render(http.StatusInternalServerError, templatePath, Resp{
				UUID:  UUID.String(),
				Error: r.(string),
			})
		}
	}()

	vm := r.get()

	token, err := auth.StripJWTFromHeaders(c)
	if err != nil {
		fmt.Println(err)
	}

	var userType string
	var user *types.User
	if token != "" {
		claims, err := auth.DecryptToken(token)
		if err != nil {
			fmt.Println(err)
		}
		userType = claims.Account.AccountType
		user = &claims.Account
	}

	ua := c.Request().Header.Get("User-Agent")
	isMobile := CheckIsMobile(ua)
	start := time.Now()

	out := map[string]interface{}{
		"url":      c.Request().URL.String(),
		"headers":  map[string][]string(c.Request().Header),
		"uuid":     UUID.String(),
		"token":    token,
		"type":     userType,
		"isMobile": isMobile,
	}

	if user != nil {
		userBytes, err := json.Marshal(user)
		Must(err)
		out["user"] = string(userBytes)
	}

	select {
	case re := <-vm.Handle(out):
		// Return vm back to the pool
		r.put(vm)

		re.RenderTime = time.Since(start)

		// Handle the Response
		if len(re.Redirect) == 0 && len(re.Error) == 0 {
			// If no redirection and no errors
			// pusher, ok := c.Response().Writer.(http.Pusher)
			// if ok {
			// 	if err = pusher.Push("style.css", nil); err != nil {
			// 		return nil
			// 	}
			// 	if err = pusher.Push("client.js", nil); err != nil {
			// 		return nil
			// 	}
			// 	if err = pusher.Push("logo.png", nil); err != nil {
			// 		return nil
			// 	}
			// }
			c.Response().Header().Set("X-React-Render-Time", re.RenderTime.String())

			return c.Render(http.StatusOK, templatePath, re)
			// If redirect
		} else if len(re.Redirect) != 0 {
			return c.Redirect(http.StatusMovedPermanently, re.Redirect)
			// If internal error
		} else if len(re.Error) != 0 {
			c.Response().Header().Set("X-React-Render-Time", re.RenderTime.String())
			return c.Render(http.StatusInternalServerError, templatePath, re)
		}
	case <-time.After(5 * time.Second): //set to ttl
		// release the context
		r.drop(vm)
		return c.Render(http.StatusInternalServerError, templatePath, Resp{
			UUID:  UUID.String(),
			Error: "timeout",
		})
	}
	return nil
}

// Resp is a struct for convinient
// react app Response parsing.
// Feel free to add any other keys to this struct
// and return value for this key at ecmascript side.
// Keep it sync with: src/app/client/router/toString.js:23
type Resp struct {
	UUID       string        `json:"uuid"`
	Error      string        `json:"error"`
	Redirect   string        `json:"redirect"`
	App        string        `json:"app"`
	Title      string        `json:"title"`
	Meta       string        `json:"meta"`
	Initial    string        `json:"initial"`
	RenderTime time.Duration `json:"-"`
}

// HTMLApp returns a application template
func (r Resp) HTMLApp() template.HTML {
	return template.HTML(r.App)
}

// HTMLTitle returns a title data
func (r Resp) HTMLTitle() template.HTML {
	return template.HTML(r.Title)
}

// HTMLMeta returns a meta data
func (r Resp) HTMLMeta() template.HTML {
	return template.HTML(r.Meta)
}

// Interface to serve React app on demand or from prepared pool.
type pool interface {
	get() *JSVM
	put(*JSVM)
	drop(*JSVM)
}

// newEnginePool return pool of JS vms.
func newEnginePool(filePath string, size int, proxy http.Handler) *enginePool {
	pool := &enginePool{
		path:  filePath,
		ch:    make(chan *JSVM, size),
		proxy: proxy,
	}

	go func() {
		for i := 0; i < size; i++ {
			pool.ch <- newJSVM(filePath, proxy)
		}
	}()

	return pool
}

type enginePool struct {
	ch    chan *JSVM
	path  string
	proxy http.Handler
}

func (o *enginePool) get() *JSVM {
	return <-o.ch
}

func (o *enginePool) put(ot *JSVM) {
	o.ch <- ot
}

func (o *enginePool) drop(ot *JSVM) {
	ot.Stop()
	ot = nil
	o.ch <- newJSVM(o.path, o.proxy)
}

// newJSVM loads bundle.js into context.
func newJSVM(filePath string, proxy http.Handler) *JSVM {
	fmt.Println("init JSVM", filePath)
	vm := &JSVM{
		EventLoop: eventloop.NewEventLoop(),
		ch:        make(chan Resp, 1),
	}

	vm.EventLoop.Start()
	fetch.Enable(vm.EventLoop, proxy)
	bundle := MustAsset(filePath)

	vm.EventLoop.RunOnLoop(func(_vm *goja.Runtime) {
		var seed int64
		if err := binary.Read(crand.Reader, binary.LittleEndian, &seed); err != nil {
			panic(fmt.Errorf("Could not read random bytes: %v", err))
		}
		_vm.SetRandSource(goja.RandSource(rand.New(rand.NewSource(seed)).Float64))

		_, err := _vm.RunScript("bundle.js", string(bundle))
		if ex, ok := err.(*goja.Exception); ok {
			panic(ex.String())
		}

		if fn, ok := goja.AssertFunction(_vm.Get("main")); ok {
			vm.fn = fn
		} else {
			fmt.Println("fn assert failed")
		}

		_vm.Set("__goServerCallback__", func(call goja.FunctionCall) goja.Value {
			obj := call.Argument(0).Export().(map[string]interface{})
			re := &Resp{}
			for _, field := range structs.Fields(re) {
				if n := field.Tag("json"); len(n) > 1 {
					field.Set(obj[n])
				}
			}
			vm.ch <- *re
			return nil
		})
	})

	return vm
}

// JSVM wraps goja EventLoop
type JSVM struct {
	*eventloop.EventLoop
	ch chan Resp
	fn goja.Callable
}

// Handle handles http requests
func (r *JSVM) Handle(req map[string]interface{}) <-chan Resp {
	r.EventLoop.RunOnLoop(func(vm *goja.Runtime) {
		r.fn(nil, vm.ToValue(req), vm.ToValue("__goServerCallback__"))
	})
	return r.ch
}

type onDemandPool struct {
	path  string
	proxy http.Handler
}

func (f *onDemandPool) get() *JSVM {
	return newJSVM(f.path, f.proxy)
}

func (f onDemandPool) put(c *JSVM) {
	c.Stop()
}

func (f *onDemandPool) drop(c *JSVM) {
	f.put(c)
}
