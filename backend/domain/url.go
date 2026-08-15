package domain

type URL struct {
	ID          int    `json:"id"`
	OriginalURL string `json:"original_url"`
	ShortCode   string `json:"short_code"`
}
