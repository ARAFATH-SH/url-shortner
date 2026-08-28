package url

import (
	"crypto/rand"
	"errors"
	"net/url"
	"url-shortener/domain"

	"github.com/lib/pq"
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

	parsedURL, err := url.ParseRequestURI(u.OriginalURL)

	if err != nil {
		return nil, errors.New("invalid URL")
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return nil, errors.New("URL must use http or https")
	}

	if parsedURL.Host == "" {
		return nil, errors.New("URL must contain a host")
	}

	const maxAttempts = 5

	for attempt := 0; attempt < maxAttempts; attempt++ {
		shortCode, err := generateShortCode(6)

		if err != nil {
			return nil, err
		}
		u.ShortCode = shortCode

		createdURL, err := svc.urlRepo.Create(u)

		if err == nil {
			return createdURL, nil
		}

		var pqErr *pq.Error

		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			continue
		}
		return nil, err
	}
	return nil, err
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
