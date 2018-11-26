package main

var (
	// Debug var to switch mode from outside
	debug string
	// CommitHash exported to assign it from main.go
	commitHash string
)

var confString = `
debug: true
commit: 0
port: 5000
title:	TalentsInAfrica
api:
  prefix: /api
duktape:
  path: static/build/bundle.js
  adminpath: static/build/admin/adminbundle.js
bucket:
  talentsinafrica
`
