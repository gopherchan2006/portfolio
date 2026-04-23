package media

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gopherchan2006/portfolio-backend/internal/httputil"
)

const maxUploadSize = 10 << 20

type Handler struct {
	storageDir string
}

func NewHandler(storageDir string) *Handler {
	return &Handler{storageDir: storageDir}
}

func (h *Handler) Register(mux *http.ServeMux, middleware func(http.Handler) http.Handler) {
	mux.Handle("POST /api/admin/media", middleware(http.HandlerFunc(h.upload)))
	mux.Handle("GET /media/", http.StripPrefix("/media/", http.FileServer(http.Dir(h.storageDir))))
}

func (h *Handler) upload(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "file too large"})
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "missing file field"})
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true, ".svg": true}
	if !allowed[ext] {
		httputil.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "unsupported file type"})
		return
	}

	if err := os.MkdirAll(h.storageDir, 0755); err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "storage error"})
		return
	}

	safe := filepath.Base(header.Filename)
	dst := filepath.Join(h.storageDir, safe)
	out, err := os.Create(dst)
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save file"})
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "write error"})
		return
	}

	httputil.WriteJSON(w, http.StatusCreated, map[string]string{
		"url": fmt.Sprintf("/media/%s", safe),
	})
}
