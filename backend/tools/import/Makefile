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


# include env vars
-include .env

KC_TOKEN := $(shell curl -s -L -X POST "http://keycloak:8080/auth/realms/pims/protocol/openid-connect/token" \
	--header "Content-Type: application/x-www-form-urlencoded" \
	--data-urlencode "grant_type=client_credentials" \
	--data-urlencode "audience=pims-service-account" \
	--data-urlencode "client_id=pims-service-account" \
	--data-urlencode "client_secret=$(Keycloak__ClientSecret)" | jq -r '.access_token')

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

token: ## Displays the current JWT Token
	@echo; echo "$(P) Your keycloak token is:"; echo
	@echo $(KC_TOKEN)

run: ## Runs PIMS Import Tool
	@echo "$(P) Activating service account..."
	@curl -L -X POST "http://localhost:5000/api/auth/activate" \
	--header "Content-Length: 0" \
	--header "Authorization: Bearer $(KC_TOKEN)"
	@echo; echo;
	@echo "$(P) Seeding docker database..."
	@dotnet run

.PHONY: help run
