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

.PHONY: migration
migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "name: " MIGRATION_NAME; \
	done ; \
	nf run knex migrate:make "$$MIGRATION_NAME"


.PHONY: bootstrap
bootstrap:
	make migrate; make start