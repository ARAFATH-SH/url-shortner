package url

import (
	"net/http"
	middleware "url-shortener/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	mux.Handle(
		"POST /urls",
		manager.With(
			http.HandlerFunc(h.CreateURL),
		),
	)
	mux.Handle(
		"GET /urls",
		manager.With(
			http.HandlerFunc(h.ListURLs),
		),
	)
	mux.Handle(
		"GET /urls/{short_code}",
		manager.With(
			http.HandlerFunc(h.GetURL),
		),
	)
	mux.Handle(
		"DELETE /urls/{short_code}",
		manager.With(
			http.HandlerFunc(h.DeleteURL),
		),
	)
}
