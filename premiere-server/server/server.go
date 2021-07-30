package server

import (
	"database/sql"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/willbarkoff/premiere/premiere-server/server/api"
	"os"
)

var r *gin.Engine
var db *sql.DB
var store cookie.Store

func Initialize(database *sql.DB) error {
	db = database
	store = cookie.NewStore([]byte(os.Getenv("SIGNING_SECRET")))

	r = gin.Default()

	api.PrepareRoutes(r, db, store)

	return nil
}

func Destroy() {

}

func Serve() error {
	return r.Run(os.Getenv("ADDRESS"))
}
