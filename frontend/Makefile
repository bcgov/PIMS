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

test: lint ## Runs frontend unit tests via Jest
	@echo "$(P) Running the unit tests..."
	@npm run test -- -u

format: ## Runs prettier
	@echo "$(P) Formatting the codebase..."
	@npm run format

lint: install format ## Runs the linter
	@echo "$(P) Running the linter..."
	@npm run lint

clean: ## Purges node_modules
	@echo "$(P) Cleaning..."
	@rm -rf node_modules
	@rm -rf $(BUILD_DIR)

node_modules: package.json
	@npm ci

install: node_modules ## Installs NPM dependencies
	@echo "$(P) Installing dependencies..."

build: install ## Builds the frontend
	@echo "$(P) Building in release mode..."
	@npm run build

run: install ## Serves the frontend via webpack-dev-server
	@echo "$(P) Running a development server..."
	@npm run start

.PHONY: help test format lint clean install build run
