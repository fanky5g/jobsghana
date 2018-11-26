package auth

import (
	"github.com/fanky5g/xxxinafrica/web/server/config"
)

var (
	cfg, _ = config.GetConfig()

	// APPRoot defines application url
	APPRoot = cfg.AppURL
)
