package log2

import (
	"io"
	"log"
	"os"
)

var (
	// Log logs application debug to file
	Log *log.Logger
)

func init() {
	file, err := os.OpenFile("debug.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("Failed to open log file", os.Stdout, ":", err)
	}

	multi := io.MultiWriter(file, os.Stdout)

	Log = log.New(multi,
		"DEBUG: ",
		log.Ldate|log.Ltime|log.Lshortfile)
}
