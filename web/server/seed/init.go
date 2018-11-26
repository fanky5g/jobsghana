package seed

import (
	// "github.com/fanky5g/xxxinafrica/web/server/api/handlers"
	"os"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

var (
	cfg, _ = config.GetConfig()

	// APPRoot defines application url
	APPRoot = cfg.AppURL
)

func migrate() error {
	db := database.GetMySQLInstance()
	defer db.Close()

	err := db.AutoMigrate(&types.User{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.ResumeDownloadRequest{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.PostType{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.Post{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.FileMetadata{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.ContactMessage{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.ResumeAlert{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.ReviewAlert{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.JobAlert{}).Error
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&types.MailListSubscriber{}).Error
	if err != nil {
		return err
	}

	return nil
}

// AddAdmins adds default system admins
func AddAdmins() error {
	templateURL := "../data/templates/registration.tmpl"

	// user, err := auth.NewUser(types.User{
	// 	Profile: types.JobProfile{
	// 		Basics: types.Profile{
	// 			Name: "Benjamin Appiah-Brobbey",
	// 		},
	// 	},
	// 	Email:           "fanky5g@gmail.com",
	// 	Password:        "delta5000",
	// 	AccountType:     "superadmin",
	// 	AccountApproved: true,
	// 	IsActivated:     true,
	// }, "superadmin", []string{"Profile"})

	// if err != nil {
	// 	return err
	// }

	// err = auth.Save(&user, templateURL)
	// if err != nil {
	// 	return err
	// }

	admin, err := auth.NewUser(types.User{
		Profile: types.JobProfile{
			Basics: types.Profile{
				Name: "Talent Community",
			},
		},
		Email:           "support@talentsinafrica.com",
		Password:        "delta5000",
		AccountType:     "superadmin",
		AccountApproved: true,
		IsActivated:     true,
	}, "superadmin", []string{"Profile"})

	if err != nil {
		return err
	}

	return auth.Save(&admin, templateURL)
}

// Seed creates dynamodb tables and associated global secondary indexes for proper indexing
func Seed() error {
	os.Setenv("TALENTSINAFRICA_LOCAL_DEV", "true")

	db := database.GetMySQLInstance()
	defer db.Close()

	err := migrate()
	if err != nil {
		return err
	}

	err = AddAdmins()
	if err != nil {
		return err
	}

	return nil
}
