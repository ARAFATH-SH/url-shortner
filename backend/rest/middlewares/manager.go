package middlewares

import (
	"net/http"
)

type Middleware func(next http.Handler) http.Handler

type Manager struct {
	globalMiddelwares []Middleware
}

func NewManager() *Manager {
	return &Manager{
		globalMiddelwares: make([]Middleware, 0),
	}
}

func (mngr *Manager) Use(middlewares ...Middleware) {
	mngr.globalMiddelwares = append(mngr.globalMiddelwares, middlewares...)
}

func (mngr *Manager) With(next http.Handler, middlewares ...Middleware) http.Handler {
	n := next

	for _, middleware := range middlewares {
		n = middleware(n)
	}

	return n
}

func (mngr *Manager) WrapMux(mux http.Handler) http.Handler {
	n := mux

	for _, middleware := range mngr.globalMiddelwares {
		n = middleware(n)
	}
	return n
}
