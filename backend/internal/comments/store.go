package comments

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

func (s *Store) ListByArticleID(ctx context.Context, articleID int) ([]Comment, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT id, article_id, author, text, created_at
		FROM comments
		WHERE article_id = $1
		ORDER BY created_at ASC
	`, articleID)
	if err != nil {
		return nil, fmt.Errorf("list comments: %w", err)
	}
	defer rows.Close()

	var list []Comment
	for rows.Next() {
		var c Comment
		if err := rows.Scan(&c.ID, &c.ArticleID, &c.Author, &c.Text, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan comment: %w", err)
		}
		c.Replies = []Reply{}
		list = append(list, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(list) == 0 {
		return []Comment{}, nil
	}

	ids := make([]int, len(list))
	idx := make(map[int]int, len(list))
	for i, c := range list {
		ids[i] = c.ID
		idx[c.ID] = i
	}

	rrows, err := s.pool.Query(ctx, `
		SELECT id, comment_id, author, text, created_at
		FROM replies
		WHERE comment_id = ANY($1)
		ORDER BY created_at ASC
	`, ids)
	if err != nil {
		return nil, fmt.Errorf("list replies: %w", err)
	}
	defer rrows.Close()

	for rrows.Next() {
		var r Reply
		if err := rrows.Scan(&r.ID, &r.CommentID, &r.Author, &r.Text, &r.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan reply: %w", err)
		}
		if i, ok := idx[r.CommentID]; ok {
			list[i].Replies = append(list[i].Replies, r)
		}
	}
	return list, rrows.Err()
}

func (s *Store) Create(ctx context.Context, articleID int, author, text string) (*Comment, error) {
	var c Comment
	err := s.pool.QueryRow(ctx, `
		INSERT INTO comments (article_id, author, text)
		VALUES ($1, $2, $3)
		RETURNING id, article_id, author, text, created_at
	`, articleID, author, text).Scan(&c.ID, &c.ArticleID, &c.Author, &c.Text, &c.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("create comment: %w", err)
	}
	c.Replies = []Reply{}
	return &c, nil
}

func (s *Store) CreateReply(ctx context.Context, commentID int, author, text string) (*Reply, error) {
	var r Reply
	err := s.pool.QueryRow(ctx, `
		INSERT INTO replies (comment_id, author, text)
		VALUES ($1, $2, $3)
		RETURNING id, comment_id, author, text, created_at
	`, commentID, author, text).Scan(&r.ID, &r.CommentID, &r.Author, &r.Text, &r.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("create reply: %w", err)
	}
	return &r, nil
}
