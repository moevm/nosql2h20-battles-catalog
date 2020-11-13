FROM python:3.6-slim-buster

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y wget && \
    apt-get install -y gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org-tools

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install -U pip setuptools && pip install -r /app/requirements.txt

WORKDIR /app/
COPY ./app /app/app

CMD gunicorn app:app --bind=0.0.0.0:3030 -w 4 -k uvicorn.workers.UvicornWorker