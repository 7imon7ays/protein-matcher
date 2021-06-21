start_clean:
	docker build . && docker build ./frontend && mkdir -p data/db && chmod 0700 data && docker compose up

start:
	docker compose up

lint:
	flake8 . --exclude=.git,env,matcher/migrations && cd frontend && yarn run eslint src && echo 'No lints found.'

test:
	cd frontend && yarn install && yarn run cypress run

