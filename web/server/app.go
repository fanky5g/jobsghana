package main

import (
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/fanky5g/xxxinafrica/web/server/api"
	"github.com/fanky5g/xxxinafrica/web/server/api/handlers"
	appConfig "github.com/fanky5g/xxxinafrica/web/server/config"
	middlewares "github.com/fanky5g/xxxinafrica/web/server/middleware"
	"github.com/fanky5g/xxxinafrica/web/server/queue"
	"github.com/fanky5g/xxxinafrica/web/server/sockets"
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"github.com/NYTimes/gziphandler"
	assetfs "github.com/elazarl/go-bindata-assetfs"
	binhtml "github.com/itsjamie/go-bindata-templates"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	uuid "github.com/nu7hatch/gouuid"
	"github.com/olebedev/config"
)

// App struct.
// There is no singleton anti-pattern,
// all variables defined locally inside
// this struct.
type App struct {
	Engine *echo.Echo
	Conf   *config.Config
	React  map[string]*React
	API    *api.API
}

// NewApp returns initialized struct
// of main server application.
func NewApp(opts ...AppOptions) *App {
	options := AppOptions{}
	for _, i := range opts {
		options = i
		break
	}

	options.init()

	// Parse config yaml string from ./conf.go
	// conf, err := appConfig.GetRawConfig()
	c, err := config.ParseYaml(confString)
	Must(err)

	appconf, err := appConfig.GetRawConfig()
	Must(err)

	conf, err := c.Extend(appconf)
	Must(err)

	// Set config variables delivered from main.go:11
	// Variables defined as ./conf.go:3
	conf.Set("debug", debug)
	conf.Set("commitHash", commitHash)

	// Parse environ variables for defined
	// in config constants
	conf.Env()

	awsKey, err := conf.String("AWSAccessKeyID")
	awsSecret, err := conf.String("AWSSecretKey")
	awsToken, err := conf.String("AWSToken")
	bucketRegion, err := conf.String("BucketRegion")
	// bucket, err := conf.String("Bucket")
	imageBucket, err := conf.String("Bucket")
	fileDB, err := conf.String("FileDB")

	if err != nil {
		log.Fatalf("App failed to start: %s", err)
	}

	awsCfg := &upload.AWSConfig{
		AWSSecretKey:   awsSecret,
		AWSToken:       awsToken,
		AWSAccessKeyID: awsKey,
		BucketRegion:   bucketRegion,
	}

	client, err := upload.CreateClient(awsCfg, imageBucket, fileDB)

	if err != nil {
		log.Fatal(err)
	}

	// move serviceworker getting into own file
	b, err := ioutil.ReadFile("server/data/static/sw.js")
	Must(err)

	// terms of service
	terms, err := ioutil.ReadFile("tos.md")
	Must(err)

	// privacy policy
	privacy, err := ioutil.ReadFile("privacy-policy.md")
	Must(err)

	// Make an engine
	engine := echo.New()

	// Use precompiled embedded templates
	engine.Renderer = NewTemplate()

	// Set up echo debug level
	//engine.Debug = conf.UBool("debug")
	engine.Debug = true

	// Regular middlewares
	engine.Use(middleware.Recover())

	engine.GET("/favicon.ico", func(c echo.Context) error {
		return c.Redirect(http.StatusMovedPermanently, "/static/images/favicon.png")
	})

	engine.GET("/sw.js", func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJavaScript)
		c.Response().WriteHeader(http.StatusOK)
		_, err = c.Response().Write(b)
		return err
	})

	engine.GET("/terms.md", func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextPlain)
		c.Response().WriteHeader(http.StatusOK)
		_, err = c.Response().Write(terms)
		return err
	})

	engine.GET("/privacy-policy.md", func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextPlain)
		c.Response().WriteHeader(http.StatusOK)
		_, err = c.Response().Write(privacy)
		return err
	})

	engine.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: `${method} | ${status} | ${uri} -> ${latency_human}` + "\n",
	}))

	engine.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Skipper: middleware.Skipper(func(c echo.Context) bool {
			if _, err = Asset(c.Request().URL.Path[1:]); err == nil {
				return true
			}
			return false
		}),
		Level: -1,
	}))

	engine.Use(middlewares.UploadMiddleware(client))

	// Initialize the application
	app := &App{
		Conf:   conf,
		Engine: engine,
		API:    &api.API{Conf: conf, HandlerFunc: &handlers.Handlers{Conf: conf, S3Client: client}},
		React: map[string]*React{
			"client": NewReact(
				conf.UString("duktape.path"),
				conf.UBool("debug"),
				engine,
			),
			"admin": NewReact(
				conf.UString("duktape.adminpath"),
				conf.UBool("debug"),
				engine,
			),
		},
	}

	// Map app and uuid for every requests
	app.Engine.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("app", app)
			id, _ := uuid.NewV4()
			c.Set("uuid", id)
			return next(c)
		}
	})

	// Bind api handling for URL api.prefix
	app.API.Bind(
		app.Engine.Group(
			app.Conf.UString("api.prefix"),
		),
	)

	fileServerHandler := gziphandler.GzipHandler(http.FileServer(&assetfs.AssetFS{
		Asset:     Asset,
		AssetDir:  AssetDir,
		AssetInfo: AssetInfo,
	}))

	// start application dispatcher
	// dispatcher is separated from echo context
	numworkers := conf.UString("NumWorkers")
	NWorkers, err := strconv.Atoi(numworkers)
	Must(err)
	queue.StartDispatcher(NWorkers)

	// start crawler
	// if os.Getenv("TALENTSINAFRICA_LOCAL_DEV") != "true" {
	// go crawler.Crawl()
	// }

	// start application websocket handler
	sockets.SocketHub.Run()
	engine.GET("/ws", sockets.SocketHandler)

	// Serve static via bindata and handle via react app
	// in case when static file was not found
	app.Engine.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			stripSubdomain := func(rawurl string) string {
				cfg, _ := appConfig.GetConfig()
				parsedOrigHost, _ := url.Parse(cfg.AppURL)

				// clean loopback address
				//replace with app domain
				if strings.Contains(rawurl, "localhost") {
					rawurl = strings.Replace(rawurl, "localhost", parsedOrigHost.Host, -1)
				}

				if strings.Contains(rawurl, "127.0.0.1") {
					rawurl = strings.Replace(rawurl, "127.0.0.1", parsedOrigHost.Host, -1)
				}

				entities := strings.Join(strings.Split(rawurl, parsedOrigHost.Host), "")
				entitiesArray := strings.Split(strings.Split(entities, ":")[0], ".")
				if len(entitiesArray) > 0 {
					return entitiesArray[0]
				}

				return ""
			}

			subdomain := stripSubdomain(c.Request().Host)

			// execute echo handlers chain
			err := next(c)
			// if page(handler) for url/method not found
			if err != nil {
				httpErr, ok := err.(*echo.HTTPError)
				if ok && httpErr.Code == http.StatusNotFound {
					// check if file exists
					// omit first `/`
					if _, err := Asset(c.Request().URL.Path[1:]); err == nil {
						fileServerHandler.ServeHTTP(
							c.Response().Writer,
							c.Request(),
						)
						return nil
					}

					ua := c.Request().Header.Get("User-Agent")
					isMobile := CheckIsMobile(ua)

					if isMobile {
						if subdomain != "admin" {
							return app.React["client"].Handle(c, "mobile.html")
						}
						// if subdomain is admin for mobile//dont handle
					}

					// if static file not found handle request via react application
					if subdomain == "admin" {
						return app.React["admin"].Handle(c, "admin.html")
					}

					return app.React["client"].Handle(c, "react.html")
					// return c.HTML(200, "Site is currently unavailable")
				}
			}
			// Move further if err is not `Not Found`
			return err
		}
	})

	return app
}

// Run runs the app
func (app *App) Run() {
	Must(app.Engine.Start(":" + app.Conf.UString("Port")))
}

// Template is custom renderer for Echo, to render html from bindata
type Template struct {
	templates *template.Template
}

// NewTemplate creates a new template
func NewTemplate() *Template {
	return &Template{
		templates: binhtml.New(Asset, AssetDir).MustLoadDirectory("templates"),
	}
}

// Render renders template
func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

// AppOptions is options struct
type AppOptions struct{}

func (ao *AppOptions) init() { /* write your own*/ }
