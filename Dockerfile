# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
# Make wait-for-it script executable.
# github.com/vishnubob/wait-for-it
RUN chmod -x wait-for-postgres.sh

