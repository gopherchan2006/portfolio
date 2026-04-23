package comments

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gopherchan2006/portfolio-backend/internal/articles"
	"github.com/gopherchan2006/portfolio-backend/internal/httputil"
)

type Handler struct {
	store        *Store
	articleStore *articles.Store
}

func NewHandler(store *Store, articleStore *articles.Store) *Handler {
	return &Handler{store: store, articleStore: articleStore}
}

func (h *Handler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/articles/{slug}/comments", h.list)
	mux.HandleFunc("POST /api/articles/{slug}/comments", h.create)
	mux.HandleFunc("POST /api/comments/{id}/replies", h.createReply)
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
	article, ok := h.resolveArticle(w, r)
	if !ok {
		return
	}
	list, err := h.store.ListByArticleID(r.Context(), article.ID)
	if err != nil {
		log.Printf("list comments: %v", err)
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, list)
}

func (h *Handler) create(w http.ResponseWriter, r *http.Request) {
	article, ok := h.resolveArticle(w, r)
	if !ok {
		return
	}

	var body struct {
		Author string `json:"author"`
		Text   string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	body.Text = strings.TrimSpace(body.Text)
	if body.Text == "" {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "text is required"})
		return
	}
	body.Author = strings.TrimSpace(body.Author)
	if body.Author == "" {
		body.Author = "Anonymous"
	}

	c, err := h.store.Create(r.Context(), article.ID, body.Author, body.Text)
	if err != nil {
		log.Printf("create comment: %v", err)
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	httputil.WriteJSON(w, http.StatusCreated, c)
}

func (h *Handler) createReply(w http.ResponseWriter, r *http.Request) {
	commentID, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid comment id"})
		return
	}

	var body struct {
		Author string `json:"author"`
		Text   string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	body.Text = strings.TrimSpace(body.Text)
	if body.Text == "" {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "text is required"})
		return
	}
	body.Author = strings.TrimSpace(body.Author)
	if body.Author == "" {
		body.Author = "Anonymous"
	}

	reply, err := h.store.CreateReply(r.Context(), commentID, body.Author, body.Text)
	if err != nil {
		log.Printf("create reply: %v", err)
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	httputil.WriteJSON(w, http.StatusCreated, reply)
}

func (h *Handler) resolveArticle(w http.ResponseWriter, r *http.Request) (*articles.Article, bool) {
	slug := r.PathValue("slug")
	article, err := h.articleStore.GetBySlug(r.Context(), slug)
	if err != nil {
		if err == articles.ErrNotFound {
			httputil.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "article not found"})
			return nil, false
		}
		log.Printf("resolve article: %v", err)
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return nil, false
	}
	return article, true
}
