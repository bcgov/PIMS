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

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: help

##############################################################################
# Local Development
##############################################################################

local: | build run ## Runs the steps for local development

restart-local: | close build run ## Recreates local environment

run: ## Runs the local development containers
	@echo "$(P) Running client and server..."
	@docker-compose up -d

close: ## Closes the local development containers
	@echo "$(P) Stopping client and server..."
	@docker-compose down

build: ## Builds the local development containers
	@echo "$(P) Building images..."
	@docker-compose build --no-cache

clean: ## Removes local containers, images, volumes, etc
	@echo "$(P) Removing containers, images, volumes etc..."
	@echo "$(P) Note: does not clear image cache."
	@docker-compose rm -f -v -s
	@docker volume rm -f pims-frontend-node-cache

local-client-tests: ## Runs the client tests in a container
	@echo "$(P) Running client unit tests..."
	@docker-compose run frontend npm test

local-server-tests: ## Runs the server tests in a container
	@echo "$(P) Running server unit tests..."
	@docker-compose run backend dotnet test

.PHONY: local restart-local run close build clean local-client-tests local-server-tests
