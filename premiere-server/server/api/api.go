package api

import (
	"database/sql"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/willbarkoff/premiere/premiere-server/l"
	"net/http"
)

type User struct {
	Email string
	Name  string
}

var r *gin.Engine
var db *sql.DB
var store cookie.Store

func PrepareRoutes(router *gin.Engine, database *sql.DB, sessions cookie.Store) {
	r = router
	db = database
	store = sessions

	PrepareAuthRoutes()
	PrepareMovieRoutes()
	PrepareListRoutes()
}

func EnsureLoggedIn(c *gin.Context) {
	id, err := getUserId(c)
	if err != nil {
		InternalServerError(c)
		l.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "internal_server_error",
		})
		return
	} else if id < 1 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"status": "error",
			"error":  "unauthorized",
		})
		return
	}

	c.Set("id", id)
}

func getUserFromId(id int) (User, error) {
	user := User{}
	err := db.QueryRow("SELECT name, email FROM users WHERE id = ?", id).Scan(&user.Name, &user.Email)
	return user, err
}

func getUserId(c *gin.Context) (int, error) {
	session, err := store.Get(c.Request, "session")
	if err != nil {
		return -1, err
	}

	id, ok := session.Values["id"].(int)
	if !ok {
		return -1, nil
	}

	return id, nil
}

func GetUser(c *gin.Context) (User, error) {
	id, err := getUserId(c)
	if err != nil {
		return User{}, err
	}

	return getUserFromId(id)
}

func InternalServerError(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"status": "error",
		"error":  "internal_server_error",
	})
}

func Unauthorized(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"status": "error",
		"error":  "unauthorized",
	})
}

func BadCredentials(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"status": "error",
		"error":  "bad_credentials",
	})
}

func MissingParams(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"status": "error",
		"error":  "missing_params",
	})
}

func InvalidMovie(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"status": "error",
		"error":  "invalid_movie",
	})
}

func MovieAdded(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"status": "error",
		"error":  "movie_added",
	})
}

func Ok(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
