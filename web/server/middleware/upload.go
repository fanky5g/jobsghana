package middleware

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"fmt"
	"github.com/labstack/echo"
	"strings"
	"sync"
)

// UploadMiddleware :middleware uploads files from an echo context
// Test handler&route. Usage here will be mimicked in any required route
func UploadMiddleware(client *upload.S3Agent) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.QueryParam("defer_upload") == "true" {
				return next(c)
			}

			if !strings.Contains(c.Request().Header.Get("Content-Type"), "multipart/form-data") {
				return next(c)
			}

			if client == nil {
				err := fmt.Errorf("nil client")
				c.Error(err)
				return err
			}

			var uploaded []types.FileMetadata
			var wg sync.WaitGroup

			form, err := c.MultipartForm()

			if err != nil {
				c.Error(err)
				return err
			}

			for k := range form.File {
				avFiles := form.File[k]
				wg.Add(len(avFiles))

				for _, file := range avFiles {
					go func() {
						defer wg.Done()
						r, err := file.Open()

						if err != nil {
							c.Error(err)
						}

						defer r.Close()
						meta, err := client.Upload(r, file.Filename)

						if err != nil {
							c.Error(err)
						}

						uploaded = append(uploaded, meta)
					}()
				}
			}

			wg.Wait()
			c.Set("files", uploaded)

			return next(c)
		}
	}
}
