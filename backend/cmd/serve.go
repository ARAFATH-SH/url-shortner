package cmd

import (
	"url-shortener/config"
	"url-shortener/rest"
)

func Serve() {
	cnf := config.GetConfig()

	server := rest.NewServer(cnf)

	server.Start()
}
