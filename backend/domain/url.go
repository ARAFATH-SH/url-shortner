package domain

type URL struct {
	ID          int    `json:"id" db:"id"`
	OriginalURL string `json:"original_url" db:"original_url"`
	ShortCode   string `json:"short_code" db:"short_code"`
}
