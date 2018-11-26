package middleware

import (
	"errors"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/log2"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/labstack/echo"
)

var logger = log2.Log

// AuthMiddleware authenticates a set of routes bound to it
func AuthMiddleware(protectedPage echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, err := auth.GetAuthenticatedUser(c)
		if err != nil {
			c.Error(err)
			return err
		}

		if user == nil {
			errString := errors.New("unauthorized to access resource")
			c.Error(errString)
			return errString
		}

		c.Set("user", *user)
		return protectedPage(c)
	}
}

// AllowOnly authenticates a route against specific users
func AllowOnly(roles []string) echo.MiddlewareFunc {
	return func(protectedPage echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, err := auth.GetAuthenticatedUser(c)
			if err != nil {
				logger.Println(err)
				c.Error(err)
				return err
			}

			if user == nil {
				errString := errors.New("unauthorized to access resource")
				c.Error(errString)
				return errString
			}

			var claims types.Claims
			claims.Account = *user

			isAuth := auth.Authorize(roles, &claims)

			if !isAuth {
				errString := errors.New("unauthorized to access resource")
				c.Error(errString)
				return errString
			}
			return protectedPage(c)
		}
	}
}
