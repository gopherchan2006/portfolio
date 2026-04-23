package comments

import (
	"time"
)

type Reply struct {
	ID        int       `json:"id"`
	CommentID int       `json:"commentId"`
	Author    string    `json:"author"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt"`
}

type Comment struct {
	ID        int       `json:"id"`
	ArticleID int       `json:"articleId"`
	Author    string    `json:"author"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt"`
	Replies   []Reply   `json:"replies"`
}
