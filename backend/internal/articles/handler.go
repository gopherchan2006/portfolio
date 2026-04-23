package articles

import (
	"errors"
	"log"
	"net/http"

	"github.com/gopherchan2006/portfolio-backend/internal/httputil"
)

type Handler struct {
	store *Store
}

func NewHandler(store *Store) *Handler {
	return &Handler{store: store}
}

func (h *Handler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/articles", h.list)
	mux.HandleFunc("GET /api/articles/{slug}", h.get)
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
	articles, err := h.store.List(r.Context())
	if err != nil {
		log.Printf("list articles: %v", err)
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	if articles == nil {
		articles = []Article{}
	}
	httputil.WriteJSON(w, http.StatusOK, articles)
}

func (h *Handler) get(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	article, err := h.store.GetBySlug(r.Context(), slug)
	if errors.Is(err, ErrNotFound) {
		httputil.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	if err != nil {
		log.Printf("get article: %v", err)
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, article)
}
