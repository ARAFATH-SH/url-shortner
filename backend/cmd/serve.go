package cmd

import (
	"fmt"
	"os"
	"url-shortener/config"
	"url-shortener/infra/db"
	"url-shortener/repo"
	"url-shortener/rest"
	urlHandler "url-shortener/rest/handlers/url"
	middleware "url-shortener/rest/middlewares"
	"url-shortener/url"
)

func Serve() {
	cnf := config.GetConfig()

	dbCon, err := db.NewConnection(cnf.DB)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = db.MigrateDB(dbCon, "./migrations")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	//repos
	urlRepo := repo.NewUrlRepo(dbCon)

	//domains
	urlService := url.NewService(urlRepo)

	middlewares := middleware.NewMiddlewares(cnf)

	//handlers
	urlHandler := urlHandler.NewHandler(middlewares, urlService)

	server := rest.NewServer(cnf, urlHandler)

	server.Start()
}
