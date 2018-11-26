package handlers

import (
	"errors"

	appConfig "github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/log2"
	"github.com/fanky5g/xxxinafrica/web/server/upload"
	"github.com/olebedev/config"
)

// Handlers holds definitions for api controllers
type Handlers struct {
	Conf     *config.Config
	S3Client *upload.S3Agent
}

var (
	cfg, _ = appConfig.GetConfig()
	logger = log2.Log
	// APPRoot defines application url
	APPRoot          = cfg.AppURL
	errBadParameters = errors.New("bad form parameters sent")
	errAlreadyExists = errors.New("already exists")
)
