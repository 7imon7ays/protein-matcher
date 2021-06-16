start:
	docker compose up

migrate-prod:
	heroku run python manage.py migrate -a protein-matcher

logs:
	heroku logs -a protein-matcher

