package url

import (
	"url-shortener/domain"
	urlHander "url-shortener/rest/handlers/url"
)

type Service interface {
	urlHander.Service
}

type URLRepo interface {
	Create(u domain.URL) (*domain.URL, error)
	FindByShortCode(shortCode string) (*domain.URL, error)
	FindAll() ([]domain.URL, error)
	Delete(shortCode string) error
}
