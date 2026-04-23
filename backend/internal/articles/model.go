package articles

import (
	"encoding/json"
	"time"
)

type Article struct {
	ID        int             `json:"id"`
	Slug      string          `json:"slug"`
	Title     string          `json:"title"`
	Summary   string          `json:"summary"`
	Tags      []string        `json:"tags"`
	Accent    string          `json:"accent"`
	ReadTime  int             `json:"readTime"`
	Content   json.RawMessage `json:"content"`
	Published bool            `json:"published"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}
