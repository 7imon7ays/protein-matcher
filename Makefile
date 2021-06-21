start_fresh:
	mkdir -p data/db && chmod 0700 data && docker compose up --force-recreate --build

start:
	docker compose up

lint:
	flake8 . --exclude=.git,env,matcher/migrations && cd frontend && yarn run eslint src && echo 'No lints found.'

logs:
	heroku logs -a protein-matcher

test:
	cd frontend && yarn install && yarn run cypress run

