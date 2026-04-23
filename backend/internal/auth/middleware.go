package auth

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gopherchan2006/portfolio-backend/internal/httputil"
)

type contextKey string

const claimsKey contextKey = "claims"

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			httputil.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "missing token"})
			return
		}
		raw := strings.TrimPrefix(header, "Bearer ")
		secret := []byte(os.Getenv("JWT_SECRET"))
		token, err := jwt.Parse(raw, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return secret, nil
		})
		if err != nil || !token.Valid {
			httputil.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid token"})
			return
		}
		ctx := context.WithValue(r.Context(), claimsKey, token.Claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
