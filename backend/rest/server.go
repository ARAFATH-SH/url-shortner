package rest

import (
	"fmt"
	"net/http"
	"strconv"
	"url-shortener/config"
	"url-shortener/rest/handlers/url"
	middleware "url-shortener/rest/middlewares"
)

type Server struct {
	cnf        *config.Config
	urlHandler *url.Handler
}

func NewServer(cnf *config.Config,
	urlHandler *url.Handler,
) *Server {
	return &Server{
		cnf:        cnf,
		urlHandler: urlHandler,
	}
}

func (server *Server) Start() error {
	manager := middleware.NewManager()

	mux := http.NewServeMux()

	manager.Use(
		middleware.Preflight,
		middleware.Cors,
		middleware.Logger,
	)

	wrappedMux := manager.WrapMux(mux)

	server.urlHandler.RegisterRoutes(mux, manager)

	address := ":" + strconv.Itoa(int(server.cnf.HttpPort))

	fmt.Println("Server is running on Port", address)

	err := http.ListenAndServe(address, wrappedMux)

	if err != nil {
		fmt.Println("Error starting server", err)
	}
	return err
}
