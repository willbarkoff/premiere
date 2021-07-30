package main

import (
	"github.com/joho/godotenv"
	"github.com/willbarkoff/premiere/premiere-server/database"
	"github.com/willbarkoff/premiere/premiere-server/server"

	"github.com/willbarkoff/premiere/premiere-server/movies"

)

func checkPanic(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	err := godotenv.Load()
	checkPanic(err)

	// initialize the database
	db, err := database.Init()
	checkPanic(err)
	defer database.Destroy(db)

	// initialize tmdb api
	movies.Init()

	// initialize server
	err = server.Initialize(db)
	checkPanic(err)
	defer server.Destroy()

	// serve
	err = server.Serve()
	checkPanic(err)
}
