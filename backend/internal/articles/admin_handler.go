package articles

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gopherchan2006/portfolio-backend/internal/httputil"
)

type AdminHandler struct {
	store *Store
}

func NewAdminHandler(store *Store) *AdminHandler {
	return &AdminHandler{store: store}
}

func (h *AdminHandler) Register(mux *http.ServeMux, middleware func(http.Handler) http.Handler) {
	mux.Handle("GET /api/admin/articles", middleware(http.HandlerFunc(h.list)))
	mux.Handle("POST /api/admin/articles", middleware(http.HandlerFunc(h.create)))
	mux.Handle("PUT /api/admin/articles/{id}", middleware(http.HandlerFunc(h.update)))
	mux.Handle("DELETE /api/admin/articles/{id}", middleware(http.HandlerFunc(h.delete)))
}

func (h *AdminHandler) list(w http.ResponseWriter, r *http.Request) {
	list, err := h.store.ListAll(r.Context())
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	if list == nil {
		list = []Article{}
	}
	httputil.WriteJSON(w, http.StatusOK, list)
}

func (h *AdminHandler) create(w http.ResponseWriter, r *http.Request) {
	var a Article
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if strings.TrimSpace(a.Slug) == "" || strings.TrimSpace(a.Title) == "" {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "slug and title are required"})
		return
	}
	out, err := h.store.Create(r.Context(), a)
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusCreated, out)
}

func (h *AdminHandler) update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
		return
	}
	var a Article
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	out, err := h.store.Update(r.Context(), id, a)
	if errors.Is(err, ErrNotFound) {
		httputil.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, out)
}

func (h *AdminHandler) delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
		return
	}
	if err := h.store.Delete(r.Context(), id); errors.Is(err, ErrNotFound) {
		httputil.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	} else if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
