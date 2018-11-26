all:
	@./installs.sh
	@echo "building container images"
	@docker-compose build
	@echo "setting up web dependencies"
	@cd ./web && sudo make install
	@echo "setting up imageserver dependencies"
	@cd ./imageserver && glide install