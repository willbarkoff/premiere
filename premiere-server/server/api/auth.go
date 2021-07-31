package api

import (
	"github.com/davecgh/go-spew/spew"
	"github.com/gin-gonic/gin"
	"github.com/willbarkoff/premiere/premiere-server/l"
	"github.com/willbarkoff/premiere/premiere-server/movies"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
)

func PrepareAuthRoutes() {
	r.GET("/auth/context", EnsureLoggedIn, func(c *gin.Context) {
		user, err := GetUser(c)
		if err != nil {
			InternalServerError(c)
			return
		}

		genres, err := movies.Genres()
		if err != nil {
			InternalServerError(c)
			return
		}

		config, err := movies.Config()
		if err != nil {
			InternalServerError(c)
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "ok", "data": gin.H{"user": user, "genres": genres, "tmdb": config}})
	})

	r.POST("/auth/register", func(c *gin.Context) {
		name := c.PostForm("name")
		email := c.PostForm("email")
		password := c.PostForm("password")
		secretCode := c.PostForm("secretCode")

		if name == "" || email == "" || password == "" || secretCode == "" {
			MissingParams(c)
			return
		}

		if secretCode != os.Getenv("SECRET_CODE") {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "error": "invalid_code"})
			return
		}

		var emailDup string
		errExists := db.QueryRow("SELECT email FROM users WHERE email = ?", email).Scan(&emailDup)
		if errExists == nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "error": "account_exists"})
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		hashStr := string(hash)
		_, err = db.Exec("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", name, email, hashStr)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		Ok(c)
	})

	r.POST("/auth/login", func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")

		if email == "" || password == "" {
			MissingParams(c)
			return
		}

		var id int
		var hash string
		err := db.QueryRow("SELECT id, password FROM users WHERE email = ?", email).Scan(&id, &hash)
		if err != nil {
			BadCredentials(c)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
		if err != nil {
			BadCredentials(c)
			return
		}

		session, err := store.Get(c.Request, "session")
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		session.Values["id"] = id
		spew.Dump(session.Values)
		err = session.Save(c.Request, c.Writer)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		Ok(c)
	})

	r.POST("/auth/logout", EnsureLoggedIn, func(c *gin.Context) {
		session, err := store.Get(c.Request, "session")
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		session.Values["id"] = -1
		spew.Dump(session.Values)
		err = session.Save(c.Request, c.Writer)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		Ok(c)
	})

	r.POST("/auth/changePassword", EnsureLoggedIn, func(c *gin.Context) {
		id := c.MustGet("id")

		newPassword := c.PostForm("newPassword")

		if newPassword == "" {
			MissingParams(c)
			return
		}

		newHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		_, err = db.Exec("UPDATE users SET password = ? WHERE id = ?", string(newHash), id)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		Ok(c)
	})
}
