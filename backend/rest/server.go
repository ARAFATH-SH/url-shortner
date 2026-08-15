package rest

import (
	"fmt"
	"net/http"
	"strconv"
	"url-shortener/config"
	middleware "url-shortener/rest/middlewares"
)

type Server struct {
	cnf *config.Config
}

func NewServer(cnf *config.Config) *Server {
	return &Server{
		cnf: cnf,
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

	address := ":" + strconv.Itoa(int(server.cnf.HttpPort))

	fmt.Println("Server is running on Port", address)

	err := http.ListenAndServe(address, wrappedMux)

	if err != nil {
		fmt.Println("Error starting server", err)
	}
	return http.ListenAndServe(address, wrappedMux)
}
