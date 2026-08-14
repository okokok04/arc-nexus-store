.PHONY: test test-contract test-frontend build dev

test: test-contract test-frontend

test-contract:
	cargo test --package restaurant-contract

test-frontend:
	npm test

build:
	npm run build

dev:
	npm run dev
