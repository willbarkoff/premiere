package api

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/willbarkoff/premiere/premiere-server/l"
	"github.com/willbarkoff/premiere/premiere-server/movies"
	"net/http"
	"strconv"
)

func PrepareMovieRoutes() {
	r.GET("/movies/genres", EnsureLoggedIn, func(c *gin.Context) {
		genres, err := movies.Genres()
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "ok", "data": genres})

	})

	r.GET("/movies/search", EnsureLoggedIn, func(c *gin.Context) {
		title := c.Query("title")

		if title == "" {
			MissingParams(c)
			return
		}

		results, err := movies.FindMovie(title)
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "ok", "data": results})
	})

	r.GET("/movies/fetch", EnsureLoggedIn, func(c *gin.Context) {
		tmdbId, err := strconv.Atoi(c.Query("id"))
		if err != nil {
			MissingParams(c)
			return
		}

		movie, err := movies.FetchMovie(tmdbId)
		if err != nil {
			InvalidMovie(c)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"data":   movie,
		})
	})

	r.POST("/movies/add", EnsureLoggedIn, func(c *gin.Context) {
		tmdbId, err := strconv.Atoi(c.PostForm("id"))
		if err != nil {
			MissingParams(c)
			return
		}

		newID := 0
		existsErr := db.QueryRow("SELECT tmdbId FROM movies WHERE tmdbId = ?", tmdbId).Scan(&newID)
		if existsErr == nil {
			MovieAdded(c)
			return
		}

		movie, err := movies.FetchMovie(tmdbId)
		if err != nil {
			InvalidMovie(c)
			return
		}

		title := movie.Title
		overview := movie.Overview
		runtime := movie.Runtime
		poster := movie.PosterPath
		release := movie.ReleaseDate
		var genres []int
		for _, genre := range movie.Genres {
			genres = append(genres, genre.ID)
		}
		genreJson, _ := json.Marshal(genres)

		_, err = db.Exec(
			"INSERT INTO movies (userId, tmdbId, title, runtime, poster, `release`, genres, overview) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			c.MustGet("id").(int),
			tmdbId,
			title,
			runtime,
			poster,
			release,
			string(genreJson),
			overview,
		)

		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		Ok(c)
	})
}
