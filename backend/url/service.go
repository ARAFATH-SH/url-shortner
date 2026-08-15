package url

import (
	"crypto/rand"
	"errors"
	"url-shortener/domain"
)

type service struct {
	urlRepo URLRepo
}

func NewService(urlRepo URLRepo) Service {
	return &service{
		urlRepo: urlRepo,
	}
}

func (svc *service) Create(u domain.URL) (*domain.URL, error) {
	if u.OriginalURL == "" {
		return nil, errors.New("Original URL is required")
	}

	shortCode, err := generateShortCode(6)

	if err != nil {
		return nil, err
	}

	u.ShortCode = shortCode
	return svc.urlRepo.Create(u)
}

func (svc *service) FindByShortCode(shortCode string) (*domain.URL, error) {
	return svc.urlRepo.FindByShortCode(shortCode)
}

func (svc *service) Delete(shortCode string) error {
	return svc.urlRepo.Delete(shortCode)
}

func generateShortCode(length int) (string, error) {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	results := make([]byte, length)

	randomBytes := make([]byte, length)

	_, err := rand.Read(randomBytes)

	if err != nil {
		return "", err
	}

	for i := range results {
		results[i] = characters[int(randomBytes[i])%len(characters)]
	}
	return string(results), nil
}
