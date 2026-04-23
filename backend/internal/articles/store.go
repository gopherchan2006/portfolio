package articles

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNotFound = errors.New("article not found")

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

func (s *Store) List(ctx context.Context) ([]Article, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT id, slug, title, summary, tags, accent, read_time,
		       content, published, created_at, updated_at
		FROM articles
		WHERE published = TRUE
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("list articles: %w", err)
	}
	defer rows.Close()

	var list []Article
	for rows.Next() {
		var a Article
		if err := rows.Scan(
			&a.ID, &a.Slug, &a.Title, &a.Summary, &a.Tags,
			&a.Accent, &a.ReadTime, &a.Content,
			&a.Published, &a.CreatedAt, &a.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan article: %w", err)
		}
		list = append(list, a)
	}
	return list, rows.Err()
}

func (s *Store) GetBySlug(ctx context.Context, slug string) (*Article, error) {
	var a Article
	err := s.pool.QueryRow(ctx, `
		SELECT id, slug, title, summary, tags, accent, read_time,
		       content, published, created_at, updated_at
		FROM articles
		WHERE slug = $1 AND published = TRUE
	`, slug).Scan(
		&a.ID, &a.Slug, &a.Title, &a.Summary, &a.Tags,
		&a.Accent, &a.ReadTime, &a.Content,
		&a.Published, &a.CreatedAt, &a.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get article by slug: %w", err)
	}
	return &a, nil
}
