start:
	docker compose up

lint:
	flake8 . --exclude=.git,env,matcher/migrations && cd frontend && yarn run eslint src && echo 'No lints found.'

logs:
	heroku logs -a protein-matcher

test:
	cd frontend && yarn run cypress run
