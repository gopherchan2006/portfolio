package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gopherchan2006/portfolio-backend/internal/articles"
	"github.com/gopherchan2006/portfolio-backend/internal/auth"
	"github.com/gopherchan2006/portfolio-backend/internal/comments"
	"github.com/gopherchan2006/portfolio-backend/internal/db"
	"github.com/gopherchan2006/portfolio-backend/internal/httputil"
	"github.com/gopherchan2006/portfolio-backend/internal/media"
)

func main() {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer pool.Close()

	migrationsDir := os.Getenv("MIGRATIONS_DIR")
	if migrationsDir == "" {
		migrationsDir = "migrations"
	}

	if err := db.Migrate(ctx, pool, migrationsDir); err != nil {
		log.Fatalf("db migrate: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		httputil.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	storageDir := os.Getenv("STORAGE_DIR")
	if storageDir == "" {
		storageDir = "storage"
	}

	articleStore := articles.NewStore(pool)
	articles.NewHandler(articleStore).Register(mux)
	articles.NewAdminHandler(articleStore).Register(mux, auth.Middleware)
	comments.NewHandler(comments.NewStore(pool), articleStore).Register(mux)
	auth.NewHandler().Register(mux)
	media.NewHandler(storageDir).Register(mux, auth.Middleware)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, corsMiddleware(mux)); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Max-Age", "86400")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
