#!/usr/bin/make

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

ifneq ($(OS),Windows_NT)
POSIXSHELL := 1
else
POSIXSHELL :=
endif

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
# Docker Development
##############################################################################

restart: ## Restart local docker environment (n=service name)
	$(info Restart local docker environment)
	@make stop n=$(n)
	@make up n=$(n)

refresh: ## Recreates local docker environment (n=service name)
	$(info Recreates local docker environment)
	@make stop n=$(n)
	@make build n=$(n)
	@make up n=$(n)

down: ## Stops the local containers and removes them
	@echo "$(P) Stopping client and server..."
	@docker compose down

stop: ## Stops the local containers (n=service name)
	@echo "$(P) Stopping client and server..."
	@docker compose stop $(n)

build: ## Builds the local containers (n=service name)
	@echo "$(P) Building images..."
	@docker compose --profile prod build --no-cache $(n)

rebuild: ## Build the local contains (n=service name) and then start them after building
	@make build n=$(n)
	@make up n=$(n)

pause-30:
	@echo "$(P) Pausing 30 seconds..."
	@-sleep 30

.PHONY: local setup restart refresh up down stop build rebuild clean client-test server-test pause-30 server-run db-migrations db-add db-update db-rollback db-remove db-clean db-drop db-refresh npm-clean npm-refresh convert
