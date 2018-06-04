KNEX=node_modules/.bin/knex

.PHONY: start
start:
	nf run nodemon .

.PHONY: install
install:
	npm install

.PHONY: migrate
migrate:
	nf run knex migrate:latest

.PHONY: rollback
rollback:
	nf run knex migrate:rollback
