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

restart: | stop build up ## Restart local docker environment

refresh: | down build up ## Recreates local docker environment

up: ## Runs the local containers (n=service name)
	@echo "$(P) Running client and server..."
	@docker-compose up -d $(n)

down: ## Stops the local containers and removes them
	@echo "$(P) Stopping client and server..."
	@docker-compose down

stop: ## Stops the local containers (n=service name)
	@echo "$(P) Stopping client and server..."
	@docker-compose stop $(n)

build: ## Builds the local containers (n=service name)
	@echo "$(P) Building images..."
	@docker-compose build --no-cache $(n)

rebuild: ## Build the local contains (n=service name) and then start them after building
	@make build n=$(n)
	@make up n=$(n)

clean: ## Removes all local containers, images, volumes, etc
	@echo "$(P) Removing all containers, images, volumes for solution."
	@docker-compose rm -f -v -s
	@docker volume rm -f pims-frontend-node-cache
	@docker volume rm -f pims-api-db-data

setup: ## Setup local container environment, initialize keycloak and database
	@make build; make up; make pause-30; make db-update; make db-seed; make keycloak-sync;

pause-30:
	@echo "$(P) Pausing 30 seconds..."
	@-sleep 30

client-test: ## Runs the client tests in a container
	@echo "$(P) Running client unit tests..."
	@docker-compose run frontend npm test

server-test: ## Runs the server tests in a container
	@echo "$(P) Running server unit tests..."
	@docker-compose run backend dotnet test

server-run: ## Starts local server containers
	@echo "$(P) Starting server containers..."
	@docker-compose up -d keycloak backend

npm-clean: ## Removes local containers, images, volumes, for frontend application.
	@echo "$(P) Removing frontend containers and volumes."
	@docker-compose stop frontend
	@docker-compose rm -f -v -s frontend
	@docker volume rm -f pims-frontend-node-cache

npm-refresh: ## Cleans and rebuilds the frontend.  This is useful when npm packages are changed.
	@make npm-clean; make build n=frontend; make up;

db-migrations: ## Display a list of migrations.
	@echo "$(P) Display a list of migrations."
	@cd backend/dal; dotnet ef migrations list

db-add: ## Add a new database migration for the specified name (n=name of migration).
	@echo "$(P) Create a new database migration for the specified name."
	@cd backend/dal; dotnet ef migrations add $(n); code -r ./Migrations/*_$(n).cs
	@./scripts/db-migration.sh $(n);

db-update: ## Update the database with the latest migration.
	@echo "$(P) Updating database with latest migration..."
	@docker-compose up -d database; cd backend/dal; dotnet ef database update

db-rollback: ## Rollback to the specified database migration (n=name of migration).
	@echo "$(P) Rollback to the specified database migration."
	@cd backend/dal; dotnet ef database update $(n);

db-remove: ## Remove the last database migration.
	@echo "$(P) Remove the last migration."
	@cd backend/dal; dotnet ef migrations remove --force;

db-clean: ## Re-creates an empty docker database - ready for seeding.
	@echo "$(P) Refreshing the database..."
	@cd backend/dal; dotnet ef database drop --force; dotnet ef database update

db-refresh: | server-run pause-30 db-clean db-seed keycloak-sync ## Refresh the database and seed it with data.

db-drop: ## Drop the database.
	@echo "$(P) Drop the database."
	@cd backend/dal; dotnet ef database drop;

db-seed: ## Imports a JSON file of properties into PIMS
	@echo "$(P) Seeding docker database..."
	@cd tools/import; dotnet build; dotnet run;

keycloak-sync: ## Syncs accounts with Keycloak and PIMS
	@echo "$(P) Syncing keycloak with PIMS..."
	@cd tools/keycloak/sync; dotnet build; dotnet run;

convert: ## Convert Excel files to JSON
	@echo "$(P) Convert Excel files to JSON..."
	@cd tools/converters/excel; dotnet build; dotnet run;

.PHONY: local setup restart refresh up down stop build rebuild clean client-test server-test pause-30 server-run db-migrations db-add db-update db-rollback db-remove db-clean db-drop db-seed db-refresh npm-clean npm-refresh keycloak-sync convert
