package movies

import (
	tmdb "github.com/ryanbradynd05/go-tmdb"
	"os"
)

var tmdbapi *tmdb.TMDb

func Init() {
	config := tmdb.Config{
		APIKey:   os.Getenv("TMDB_KEY"),
		Proxies:  nil,
		UseProxy: false,
	}

	tmdbapi = tmdb.Init(config)
}

func FindMovie(movie string) (*tmdb.MovieSearchResults, error) {
	return tmdbapi.SearchMovie(movie, nil)
}

func Genres() (*tmdb.Genre, error) {
	return tmdbapi.GetMovieGenres(nil)
}

func Config() (*tmdb.Configuration, error) {
	return tmdbapi.GetConfiguration()
}

func FetchMovie(id int) (*tmdb.Movie, error) {
	return tmdbapi.GetMovieInfo(id, nil)
}