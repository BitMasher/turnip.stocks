package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/ilyakaznacheev/cleanenv"
	"log"
	"net/http"
	"time"
)

type ServerConfig struct {
	// HTTP configs
	ServerPort int `env:"PORT" env-default:"3000" env-description:"The port to run the HTTP server on"`
}

func main() {

	var config ServerConfig

	err := cleanenv.ReadEnv(&config)
	if err != nil {
		panic(err)
	}

	// TODO: provide better error for invalid port numbers
	// TODO: check more invalid port numbers than just 0
	if config.ServerPort == 0 {
		panic("Invalid port number supplied")
	}

	router := mux.NewRouter()
	staticFs := RedirectingFileSystem{http.Dir("static")}
	router.PathPrefix("/").Handler(http.FileServer(staticFs))

	srv := &http.Server{
		Handler: router,
		Addr:    fmt.Sprintf(":%d", config.ServerPort),
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Print("Starting HTTP server")
	log.Fatal(srv.ListenAndServe())
}
