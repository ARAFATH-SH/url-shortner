package cmd

import (
	"fmt"
	"os"
	"url-shortener/config"
	"url-shortener/infra/db"
	"url-shortener/rest"
)

func Serve() {
	cnf := config.GetConfig()

	dbCon, err := db.NewConnection(cnf.DB)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = db.MigrateDB(dbCon, "./migrations")

	server := rest.NewServer(cnf)

	server.Start()
}
