# ============================================================================
#  Vizualabs - Official Website  |  Makefile
#
#  Works on Linux, macOS, WSL, and Git Bash (MSYS2).
#  On plain Windows CMD, use `make.bat <command>` instead (same commands).
# ============================================================================

SHELL := /bin/sh
BUN   ?= bun

.DEFAULT_GOAL := help

.PHONY: help start install dev build preview routes typecheck test test-ui clean env

help: ## Show available commands
	@echo ""
	@echo "  Vizualabs - Official Website"
	@echo "  ================================================"
	@echo "  Usage: make <command>"
	@echo "  (Windows CMD: make.bat <command>)"
	@echo ""
	@echo "  Commands:"
	@echo "    start        One-shot setup: install deps + env, then run dev"
	@echo "    install      Install dependencies (bun install)"
	@echo "    dev          Start the dev server (http://localhost:3000)"
	@echo "    build        Build the app for production"
	@echo "    preview      Preview the production build locally"
	@echo "    routes       Regenerate the TanStack Router route tree"
	@echo "    typecheck    Run TypeScript type checking (tsc --noEmit)"
	@echo "    test         Run Playwright end-to-end tests"
	@echo "    test-ui      Run Playwright tests in UI mode"
	@echo "    clean        Remove build artifacts (dist, test-results, .tanstack)"
	@echo "    env          Copy .env.example -> .env (if missing)"
	@echo ""

start: ## One-shot: install + env, then dev
	@if [ ! -d node_modules ]; then echo "Installing dependencies..."; $(BUN) install; fi
	@if [ ! -f .env ]; then echo "Creating .env from .env.example"; cp .env.example .env; fi
	$(BUN) --bun run dev

install: ## Install dependencies
	$(BUN) install

dev: ## Start the dev server
	$(BUN) --bun run dev

build: ## Build for production
	$(BUN) --bun run build

preview: ## Preview the production build
	$(BUN) run preview

routes: ## Regenerate the route tree
	$(BUN) run generate-routes

typecheck: ## Type-check the project
	$(BUN)x tsc --noEmit

test: ## Run end-to-end tests
	$(BUN) run test:e2e

test-ui: ## Run end-to-end tests (UI mode)
	$(BUN) run test:e2e:ui

clean: ## Remove build artifacts
	rm -rf dist test-results .tanstack
	@echo "Cleaned."

env: ## Create .env from .env.example
	@if [ -f .env ]; then echo ".env already exists."; else cp .env.example .env && echo "Created .env from .env.example"; fi
