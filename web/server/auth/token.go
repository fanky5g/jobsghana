package auth

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"io"
	"os"
)

var signingKey []byte

func init() {
	signingKey = []byte(os.Getenv("Secret"))
}

// DecryptToken decrypts a serialised jwt token
func DecryptToken(token string) (*types.Claims, error) {
	t, err := jwt.ParseWithClaims(token, &types.Claims{}, func(tokenString *jwt.Token) (interface{}, error) {
		if _, ok := tokenString.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected siging method")
		}
		return signingKey, nil
	})

	if err != nil {
		return &types.Claims{}, err
	}

	if claims, ok := t.Claims.(*types.Claims); ok && t.Valid {
		return claims, nil
	}

	return &types.Claims{}, fmt.Errorf("token parse failure")
}

// GenVerificationToken generates a unique token to send user email
func GenVerificationToken() (string, error) {
	token := make([]byte, 21)
	_, err := rand.Read(token)

	if err != nil {
		return "", err
	}

	h := md5.New()
	io.WriteString(h, string(token[:]))

	return EncryptPassword(hex.EncodeToString(h.Sum(nil)))
}
