package api

import (
	"github.com/fanky5g/xxxinafrica/web/server/api/handlers"
	"github.com/fanky5g/xxxinafrica/web/server/middleware"
	"github.com/labstack/echo"
	"github.com/olebedev/config"
)

// API exports application api interface and route handlers
type API struct {
	Conf        *config.Config
	HandlerFunc *handlers.Handlers
}

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	group.GET("/v1/conf", api.ConfHandler)

	// users
	group.POST("/v1/users/join", api.HandlerFunc.RegisterHandler)
	group.GET("/v1/users/activate", api.HandlerFunc.ActivateUserHandler)
	group.POST("/v1/users/authenticate", api.HandlerFunc.AuthenticateUserHandler)
	group.POST("/v1/users/authorise", api.HandlerFunc.IsAuthorizedHandler)
	group.POST("/v1/users/me", api.HandlerFunc.GetAuthenticatedUserHandler)
	group.GET("/v1/users/logout", api.HandlerFunc.LogoutUserHandler)

	// jobs
	group.GET("/v1/jobs/find", api.HandlerFunc.SearchJob)
	group.POST("/v1/jobs/index", api.HandlerFunc.IndexJobs)
	group.GET("/v1/jobs/get_random", api.HandlerFunc.GetRandomJobs)
	// group.GET("/v1/jobs/suggest", api.HandlerFunc.SuggestJob)

	// resume
	group.GET("/v1/resume/find", api.HandlerFunc.FindResume)
	group.POST("/v1/accounts/addAttachment", api.HandlerFunc.AttachFiles)
	// group.GET("/v1/resume/suggest", api.HandlerFunc.SuggestResume)
	group.POST("/v1/resume/parse", api.HandlerFunc.ParseResume)
	group.POST("/v1/resume/viewed", api.HandlerFunc.ResumeViewed)
	group.POST("/v1/resume/download/start", api.HandlerFunc.InitiateResumeDownload)
	group.GET("/v1/resume/download/checkout", api.HandlerFunc.ProcessCheckout)
	group.GET("/v1/resume/callback", api.HandlerFunc.ResumeDownloadCallback)
	group.GET("/v1/resume/get", api.HandlerFunc.GetResume)

	group.POST("/v1/accounts/editResume", api.HandlerFunc.EditResume)
	group.POST("/v1/accounts/saveResume", api.HandlerFunc.SaveResume)

	// maillist
	group.POST("/v1/career-advice/maillist", api.HandlerFunc.SubscribeToMailList)

	// messages
	group.GET("/v1/message", api.HandlerFunc.GetNewMessages)
	group.PUT("/v1/message", api.HandlerFunc.MarkMessageAsRead)
	group.POST("/v1/message", api.HandlerFunc.SendMessage)

	// subscriptions
	group.POST("/v1/subscriptions/review_alert", api.HandlerFunc.SaveReviewAlert)
	group.POST("/v1/subscriptions/resume_request", api.HandlerFunc.SaveResumeAlert)
	group.POST("/v1/subscriptions/job_alerts", api.HandlerFunc.SaveJobAlert)

	adminGroup := *group
	// admin only routes
	adminGroup.Use(middleware.AllowOnly([]string{"superadmin", "admin"}))
	// accounts
	adminGroup.GET("/v1/accounts", api.HandlerFunc.GetAccounts)
	adminGroup.POST("/v1/accounts/approve", api.HandlerFunc.ApproveAccount)
	adminGroup.POST("/v1/accounts/directmessage", api.HandlerFunc.SendTargetedMessage)

	// blog
	group.GET("/v1/blog/posts", api.HandlerFunc.GetPosts)
	group.GET("/v1/blog/posts/:shorturl", api.HandlerFunc.GetPost)
	group.GET("/v1/blog/posts/related/:shorturl", api.HandlerFunc.GetRelatedPosts)
	adminGroup.POST("/v1/blog/posts", api.HandlerFunc.CreatePost)
	adminGroup.PUT("/v1/blog/posts", api.HandlerFunc.UpdatePost)
	adminGroup.DELETE("/v1/blog/posts/:shorturl", api.HandlerFunc.DeletePost)
	adminGroup.POST("/v1/blog/posts/publish/:shorturl", api.HandlerFunc.PublishPost)
	adminGroup.POST("/v1/blog/posts/unpublish/:shorturl", api.HandlerFunc.UnpublishPost)

	//subscriptions
	adminGroup.GET("/v1/subscriptions/job_alert", api.HandlerFunc.GetJobAlerts)
	adminGroup.GET("/v1/subscriptions/review_alert", api.HandlerFunc.GetReviewAlerts)
	adminGroup.GET("/v1/subscriptions/resume_alert", api.HandlerFunc.GetResumeAlerts)
	adminGroup.GET("/v1/subscriptions/newsletter", api.HandlerFunc.GetMaillistSubscribers)

	// blogpost types
	group.POST("/v1/blog/posts/types", api.HandlerFunc.CreatePostType)
	adminGroup.DELETE("/v1/blog/posts/types/:id", api.HandlerFunc.DeletePostType)
}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c echo.Context) error {
	return c.JSON(200, api.Conf.Root)
}
