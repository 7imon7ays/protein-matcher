start:
	docker compose up

logs:
	heroku logs -a protein-matcher

migrate-prod:
	heroku run python manage.py migrate -a protein-matcher

shell:
	python manage.py shell

