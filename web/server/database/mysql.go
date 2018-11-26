package database

import (
	"github.com/fanky5g/xxxinafrica/web/server/config"
	"fmt"
	"github.com/jinzhu/gorm"
	// brings postgresql into scope
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// GetMySQLInstance connects to postgresql and returns database connection instance
func GetMySQLInstance() *gorm.DB {
	cfg, _ := config.GetConfig()
	dbName := cfg.DBName
	dbUser := cfg.DBUser
	dbPass := cfg.DBPass

	db, err := gorm.Open("postgres", fmt.Sprintf("host=postgresql user=%s dbname=%s sslmode=disable password=%s", dbUser, dbName, dbPass))

	if err != nil {
		panic(err)
	}
	return db
}
