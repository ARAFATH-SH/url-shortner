package middlewares

import (
	"url-shortener/config"
)

type Middlewares struct {
	cnf *config.Config
}

func NewMiddlewares(cnf *config.Config) *Middlewares {
	return &Middlewares{
		cnf: cnf,
	}
}
