package api

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/willbarkoff/premiere/premiere-server/l"
	"net/http"
)

type Movie struct {
	ID       int
	UserID   int
	TMDBID   int
	Title    string
	Runtime  string
	Poster   string
	Release  string
	Genres   []int
	Overview string
}

func PrepareListRoutes() {
	r.GET("/list", EnsureLoggedIn, func(c *gin.Context) {
		rows, err := db.Query("SELECT id, userId, tmdbId, title, runtime, poster, `release`, genres, overview FROM movies")
		if err != nil {
			InternalServerError(c)
			l.Error(err)
			return
		}

		defer rows.Close()

		var movies []Movie

		for rows.Next() {
			movie := Movie{}
			var genres string
			err := rows.Scan(
				&movie.ID,
				&movie.UserID,
				&movie.TMDBID,
				&movie.Title,
				&movie.Runtime,
				&movie.Poster,
				&movie.Release,
				&genres,
				&movie.Overview,
			)
			if err != nil {
				InternalServerError(c)
				l.Error(err)
				return
			}

			err = json.Unmarshal([]byte(genres), &movie.Genres)
			if err != nil {
				InternalServerError(c)
				l.Error(err)
				return
			}

			movies = append(movies, movie)
		}

		c.JSON(http.StatusOK, gin.H{"status": "ok", "data": movies})
	})
}
