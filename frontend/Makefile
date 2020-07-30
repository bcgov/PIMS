#!/usr/bin/make

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

# to see all colors, run
# bash -c 'for c in {0..255}; do tput setaf $c; tput setaf $c | cat -v; echo =$c; done'
# the first 15 entries are the 8-bit colors

# define standard colors
BLACK        := $(shell tput -Txterm setaf 0)
RED          := $(shell tput -Txterm setaf 1)
GREEN        := $(shell tput -Txterm setaf 2)
YELLOW       := $(shell tput -Txterm setaf 3)
LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
PURPLE       := $(shell tput -Txterm setaf 5)
BLUE         := $(shell tput -Txterm setaf 6)
WHITE        := $(shell tput -Txterm setaf 7)

RESET := $(shell tput -Txterm sgr0)

# default "prompt"
P = ${GREEN}[+]${RESET}

# Frontend-specific variables
BIN_DIR ?= node_modules/.bin
BUILD_DIR ?= build

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: help

##############################################################################
# Local Development
##############################################################################

local: | local-build local-run ## Runs the steps for local (non-docker) development

test: | lint ## Runs frontend unit tests via Jest
	@echo -e "\n$(P) Running the unit tests..."
	@npm run test -- -u

format: ## Runs prettier on local filesystem
	@echo -e "\n$(P) Formatting the codebase..."
	@npm run format

lint: | format ## Runs the linter on local filesystem
	@echo -e "\n$(P) Running the linter..."
	@npm run lint

local-clean: ## Purges node_modules on local filesystem
	@echo -e "\n$(P) Cleaning node_modules..."
	@rm -rf node_modules
	@rm -rf $(BUILD_DIR)

local-install: ## Installs NPM dependencies on local filesystem
	@echo -e "\n$(P) Installing dependencies..."
	@npm ci

local-build: ## Builds the frontend app on local filesystem
	@echo -e "\n$(P) Building in release mode..."
	@npm run build

local-run: ## Serves the frontend via webpack-dev-server
	@echo -e "\n$(P) Removing frontend docker container and building local dev version..."
	@docker-compose rm -f -v -s frontend
	@npm run start

needs-rebase:
	$(eval GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD))
	@echo -e "\n$(P) Checking if current branch '$(GIT_BRANCH)' is up-to-date with 'upstream/dev'..."
	@git fetch --all
	$(eval HASH1 := $(shell git rev-parse --verify upstream/dev))
	@echo "git-hash 1: $(HASH1)"
	$(eval HASH2 := $(shell git merge-base upstream/dev "$(GIT_BRANCH)"))
	@echo "git-hash 2: $(HASH2)"
	@[ "$(HASH1)" = "$(HASH2)" ] && echo -e "OK" || (echo -e "\nFAIL: Rebase is required. Aborting.\n"; exit 1)

pr: | needs-rebase test local-build ## Runs various checks before a pull request is submitted
	@echo -e "\n$(P) All checks PASSED. Pull request can be submitted..."

.PHONY: local test format lint local-clean local-install local-build local-run rebuild-all-local-friendly-message pr

##############################################################################
# Docker Development
##############################################################################

docker: | build run rebuild-all-local-friendly-message ## Builds and runs the docker containers

restart: | stop build run rebuild-all-local-friendly-message ## Rebuilds the docker containers

build-all: ## Rebuilds all docker containers for this project
	@echo -e "\n$(P) Building images..."
	@docker-compose build --force-rm --no-cache

build: ## Builds the frontend container
	@echo -e "\n$(P) Building images..."
	@docker-compose build --force-rm --no-cache frontend

run: ## Runs the frontend docker container
	@echo -e "\n$(P) Running client and server..."
	@docker-compose up -d

stop: ## Tears down the docker development containers
	@echo -e "\n$(P) Stopping client and server..."
	@docker-compose down

clean: ## Removes local docker containers, images, volumes, etc
	@echo -e "\n$(P) Removing containers, images, volumes etc..."
	@echo "$(P) Note: does not clear image cache."
	@docker-compose rm -f -v -s frontend
	@docker volume rm -f pims-frontend-node-cache

rebuild-all-local-friendly-message:
	@echo -e "\n$(P) pims_frontend will be available at http://localhost:3000"
	@echo "$(P) pims_backend will be available at http://localhost:5000"
	@echo "$(P) pims_database will be available at http://localhost:5433"
	@echo "$(P) pims_keycloak will be available at http://keycloak:8080"

.PHONY: docker restart build run stop clean
