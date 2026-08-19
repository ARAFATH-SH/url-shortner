package repo

import (
	"fmt"
	"url-shortener/domain"
	"url-shortener/url"

	"github.com/jmoiron/sqlx"
)

type URLRepo interface {
	url.URLRepo
}

type urlRepo struct {
	db *sqlx.DB
}

func NewUrlRepo(db *sqlx.DB) URLRepo {
	repo := &urlRepo{
		db: db,
	}
	return repo
}

func (r *urlRepo) Create(url domain.URL) (*domain.URL, error) {
	query := `
		INSERT INTO urls (original_url, short_code)
		VALUES ($1, $2)
		RETURNING id
	`

	row := r.db.QueryRow(
		query,
		url.OriginalURL,
		url.ShortCode,
	)

	err := row.Scan(&url.ID)

	if err != nil {
		return nil, err
	}

	fmt.Println("INSERTED:", url)

	return &url, nil
}

func (r *urlRepo) FindByShortCode(shortCode string) (*domain.URL, error) {
	var url domain.URL

	query := `
		SELECT id, original_url, short_code
		FROM urls
		WHERE short_code = $1
	`
	err := r.db.Get(&url, query, shortCode)

	if err != nil {
		return nil, err
	}
	return &url, nil
}

func (r *urlRepo) Delete(shortCode string) error {
	query := `
		DELETE FROM urls
		WHERE short_code = $1
	`

	_, err := r.db.Exec(query, shortCode)

	return err

}
