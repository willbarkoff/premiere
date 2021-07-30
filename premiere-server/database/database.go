package database

import (
	"database/sql"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func Init() (*sql.DB, error) {
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	return db, err
}

func Destroy(db *sql.DB) {
	db.Close()
}
