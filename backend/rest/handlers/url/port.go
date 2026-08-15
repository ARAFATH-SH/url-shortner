package url

import "url-shortener/domain"

type Service interface {
	Create(u domain.URL) (*domain.URL, error)
	FindByShortCode(shortCode string) (*domain.URL, error)
	Delete(shortCode string) error
}
