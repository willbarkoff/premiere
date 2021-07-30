package l

import (
	"log"
	"runtime/debug"
)

func Error(err error) {
	log.Println(err)
	debug.PrintStack()
}

func Things(things ...interface{}) {
	log.Println(things...)
}
