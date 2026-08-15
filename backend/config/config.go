package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var configurations *Config

type DBConfig struct {
	Host          string
	Port          int64
	Name          string
	User          string
	Password      string
	EnableSSLMode bool
}

type Config struct {
	Version     string
	ServiceName string
	HttpPort    int64
	DB          *DBConfig
}

func loadConfig() {
	err := godotenv.Load()

	if err != nil {
		fmt.Println("Failed to load env variables", err)
		os.Exit(1)
	}

	version := os.Getenv("VERSION")
	if version == "" {
		log.Fatal("Version is required")
		os.Exit(1)
	}

	serviceName := os.Getenv("SERVICE_NAME")
	if serviceName == "" {
		log.Fatal("Service name is required")
		os.Exit(1)
	}

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		log.Fatal("HttpPort is required")
		os.Exit(1)
	}

	port, err := strconv.ParseInt(httpPort, 10, 64)

	if err != nil {
		fmt.Println("Port must be a number")
		os.Exit(1)
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		fmt.Println("Host is required")
		os.Exit(1)
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		fmt.Println("Database Port is required")
		os.Exit(1)
	}
	dbPrt, err := strconv.ParseInt(dbPort, 10, 64)
	if err != nil {
		fmt.Println("Port must be a number")
		os.Exit(1)
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		fmt.Println("Database Name is required")
		os.Exit(1)
	}

	dbUser := os.Getenv("DB_USER")

	if dbUser == "" {
		fmt.Println("Database User is required")
		os.Exit(1)
	}

	dbPass := os.Getenv("DB_PASSWORD")
	if dbPass == "" {
		fmt.Println("Database Password is required")
		os.Exit(1)
	}

	enable_ssl_mode := os.Getenv("DB_ENABLE_SSL_MODE")
	enableSSL, err := strconv.ParseBool(enable_ssl_mode)

	if err != nil {
		fmt.Println("Invalid enable ssl mode")
		os.Exit(1)
	}

	dbConfig := &DBConfig{
		Host:          host,
		Port:          dbPrt,
		Name:          dbName,
		User:          dbUser,
		Password:      dbPass,
		EnableSSLMode: enableSSL,
	}

	configurations = &Config{
		Version:     version,
		ServiceName: serviceName,
		HttpPort:    port,
		DB:          dbConfig,
	}
}

func GetConfig() *Config {
	if configurations == nil {
		loadConfig()
	}
	return configurations
}
