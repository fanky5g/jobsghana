package auth

import (
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/sessions"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"errors"
	"fmt"
	"github.com/labstack/echo"
	"strings"
	"time"
)

// Authorize provides role based access control
func Authorize(roles []string, claim *types.Claims) (authorised bool) {
	s := []byte(claim.Account.Role.Role)
	key := []byte(claim.Account.Role.Key)

	decrypted, _ := util.DecryptString(key, s)

	for _, role := range roles {
		if role == string(decrypted) {
			authorised = true
		}
	}

	return
}

// Authenticate verifies a user credentials against
func Authenticate(u, p string) (string, string, error) {
	var user types.User

	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.Where(&types.User{Email: u}).First(&user).Error
	if err != nil && err.Error() != "record not found" {
		return "", "", err
	}

	if err != nil && err.Error() == "record not found" {
		return "", "", errors.New("user not found")
	}

	passmatch, _ := VerifyPass(user.Password, p)
	if !passmatch {
		return "", "", errors.New("incorrect password")
	}

	// skipping this for now cos we need to save user details in resume steps
	// user cannot access their profile if not activated, but can login
	// if !user.IsActivated {
	// 	return "", "", errors.New("account not verified")
	// }

	expire := time.Now().Sub(time.Now().Add(-time.Hour * 24 * 2)) //2 weeks validity

	utoken, err := user.GenerateJWTToken(fmt.Sprintf("%s", APPRoot), expire)
	if err != nil {
		return "", "", err
	}

	return utoken, user.AccountType, nil
}

// GetAuthenticatedUser decodes a token on request object and attaches a user object to echo Context
func GetAuthenticatedUser(c echo.Context) (*types.User, error) {
	authHeader := c.Request().Header.Get("Authorization")
	// add cookie store implementation here
	store, err := sessions.GetSessionStore()
	if err != nil {
		return nil, err
	}

	session, err := store.Get(c.Request(), "token-store")
	if err != nil {
		return nil, err
	}

	if session == nil && authHeader == "" {
		return nil, errors.New("authorization header not present")
	}

	var token string
	if authHeader != "" {
		tokenArray := strings.Split(authHeader, " ")

		if len(tokenArray) < 2 {
			return nil, errors.New("invalid authorization header")
		}

		token = tokenArray[1]
	} else if session != nil {
		if _, ok := session.Values["token"]; ok {
			token = session.Values["token"].(string)
		}
	}

	if token != "" {
		claims, err := DecryptToken(token)
		if err != nil {
			// todo:implement logging logic to report application errors
			// logger.Send(err)
			return nil, errors.New("token validation failed")
		}

		if claims != nil && claims.Valid() == nil {
			return &claims.Account, nil
		}
	}

	return nil, errors.New("not authorized")
}

// StripJWTFromHeaders strips Authorisation header from request headers
func StripJWTFromHeaders(c echo.Context) (string, error) {
	authHeader := c.Request().Header.Get("Authorization")
	// add cookie store implementation here
	store, err := sessions.GetSessionStore()
	if err != nil {
		return "", err
	}

	session, err := store.Get(c.Request(), "token-store")
	if err != nil {
		return "", err
	}

	if session == nil && authHeader == "" {
		return "", errors.New("authorization header not present")
	}

	var token string
	if authHeader != "" {
		tokenArray := strings.Split(authHeader, " ")
		if len(tokenArray) < 2 {
			return "", errors.New("invalid authorization header")
		}

		token = tokenArray[1]
	} else if session != nil {
		if _, ok := session.Values["token"]; ok {
			token = session.Values["token"].(string)
		}
	}

	return token, nil
}

// UpdateContext updates sessions after edit purposes
func UpdateContext(c echo.Context, user types.User) (echo.Context, error) {
	expire := time.Now().Sub(time.Now().Add(-time.Hour * 24 * 2)) //2 weeks validity

	utoken, err := user.GenerateJWTToken(fmt.Sprintf("%s", APPRoot), expire)
	if err != nil {
		return c, err
	}

	c.Response().Header().Set("Authorization", fmt.Sprintf("Bearer %s", utoken))
	// save sessions and set cookie
	store, err := sessions.GetSessionStore()
	if err != nil {
		return c, err
	}

	session, err := store.Get(c.Request(), "token-store")
	if err != nil {
		return c, err
	}

	session.Options.MaxAge = int(time.Now().Sub(time.Now().Add(-time.Hour * 24 * 2)).Nanoseconds()) //2 weeks validity
	session.Values["token"] = utoken

	if err = session.Save(c.Request(), c.Response().Writer); err != nil {
		return c, fmt.Errorf("context update failed")
	}

	return c, nil
}
