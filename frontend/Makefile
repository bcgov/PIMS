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
	@echo "$(P) Running the unit tests..."
	@npm run test -- -u

format: ## Runs prettier on local filesystem
	@echo "$(P) Formatting the codebase..."
	@npm run format

lint: | format ## Runs the linter on local filesystem
	@echo "$(P) Running the linter..."
	@npm run lint

local-clean: ## Purges node_modules on local filesystem
	@echo "$(P) Cleaning..."
	@rm -rf node_modules
	@rm -rf $(BUILD_DIR)

local-install: ## Installs NPM dependencies on local filesystem
	@echo "$(P) Installing dependencies..."
	@npm ci

local-build: ## Builds the frontend app on local filesystem
	@echo "$(P) Building in release mode..."
	@npm run build

local-run: ## Serves the frontend via webpack-dev-server
	@echo "$(P) Removing frontend docker container and building local dev version..."
	@docker-compose rm -f -v -s frontend
	@npm run start

.PHONY: local test format lint local-clean local-install local-build local-run rebuild-all-local-friendly-message

##############################################################################
# Docker Development
##############################################################################

docker: | build run rebuild-all-local-friendly-message ## Builds and runs the docker containers

restart: | stop build run rebuild-all-local-friendly-message ## Rebuilds the docker containers

build-all: ## Rebuilds all docker containers for this project
	@echo "$(P) Building images..."
	@docker-compose build --force-rm --no-cache

build: ## Builds the frontend container
	@echo "$(P) Building images..."
	@docker-compose build --force-rm --no-cache frontend

run: ## Runs the frontend docker container
	@echo "$(P) Running client and server..."
	@docker-compose up -d

stop: ## Tears down the docker development containers
	@echo "$(P) Stopping client and server..."
	@docker-compose down

clean: ## Removes local docker containers, images, volumes, etc
	@echo "$(P) Removing containers, images, volumes etc..."
	@echo "$(P) Note: does not clear image cache."
	@docker-compose rm -f -v -s frontend
	@docker volume rm -f pims-frontend-node-cache

rebuild-all-local-friendly-message:
	@echo "$(P) pims_frontend will be available at http://localhost:3000"
	@echo "$(P) pims_backend will be available at http://localhost:5000"
	@echo "$(P) pims_database will be available at http://localhost:5433"
	@echo "$(P) pims_keycloak will be available at http://keycloak:8080"

.PHONY: docker restart build run stop clean
