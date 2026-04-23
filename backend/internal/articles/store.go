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

func (s *Store) Create(ctx context.Context, a Article) (*Article, error) {
	var out Article
	err := s.pool.QueryRow(ctx, `
		INSERT INTO articles (slug, title, summary, tags, accent, read_time, content, published)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, slug, title, summary, tags, accent, read_time,
		          content, published, created_at, updated_at
	`, a.Slug, a.Title, a.Summary, a.Tags, a.Accent, a.ReadTime, a.Content, a.Published,
	).Scan(
		&out.ID, &out.Slug, &out.Title, &out.Summary, &out.Tags,
		&out.Accent, &out.ReadTime, &out.Content,
		&out.Published, &out.CreatedAt, &out.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("create article: %w", err)
	}
	return &out, nil
}

func (s *Store) Update(ctx context.Context, id int, a Article) (*Article, error) {
	var out Article
	err := s.pool.QueryRow(ctx, `
		UPDATE articles
		SET slug=$1, title=$2, summary=$3, tags=$4, accent=$5,
		    read_time=$6, content=$7, published=$8, updated_at=NOW()
		WHERE id=$9
		RETURNING id, slug, title, summary, tags, accent, read_time,
		          content, published, created_at, updated_at
	`, a.Slug, a.Title, a.Summary, a.Tags, a.Accent, a.ReadTime, a.Content, a.Published, id,
	).Scan(
		&out.ID, &out.Slug, &out.Title, &out.Summary, &out.Tags,
		&out.Accent, &out.ReadTime, &out.Content,
		&out.Published, &out.CreatedAt, &out.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("update article: %w", err)
	}
	return &out, nil
}

func (s *Store) Delete(ctx context.Context, id int) error {
	tag, err := s.pool.Exec(ctx, `DELETE FROM articles WHERE id=$1`, id)
	if err != nil {
		return fmt.Errorf("delete article: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *Store) ListAll(ctx context.Context) ([]Article, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT id, slug, title, summary, tags, accent, read_time,
		       content, published, created_at, updated_at
		FROM articles
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("list all articles: %w", err)
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
