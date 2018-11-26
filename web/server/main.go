package main

import (
	// "github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/codegangsta/cli"
	// "github.com/pkg/profile"
	"os"
)

func main() {
	// defer profile.Start(profile.CPUProfile, profile.ProfilePath(".")).Stop()
	// userIndex, err := database.GetBleveUserIndex()
	// Must(err)
	// defer userIndex.Close()

	// jobIndex, err := database.GetBleveIndex()
	// Must(err)
	// defer jobIndex.Close()
	Run(os.Args)
}

// Run creates, configures and runs
// main cli.App
func Run(args []string) {
	app := cli.NewApp()
	app.Name = "app"
	app.Usage = "React server application"

	app.Commands = []cli.Command{
		{
			Name:   "run",
			Usage:  "Runs server",
			Action: RunServer,
		},
	}
	app.Run(args)
}

// RunServer creates, configures and runs
// main server.App
func RunServer(c *cli.Context) {
	app := NewApp(AppOptions{
	// see server/app.go:150
	})
	app.Run()
}
