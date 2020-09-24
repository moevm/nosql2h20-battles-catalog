FROM python:3.7

RUN apt-get update && apt-get upgrade

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

WORKDIR /app/
COPY ./app /app/app
RUN ls

EXPOSE 3030

CMD gunicorn app:app --bind=0.0.0.0:3030 -w 4 -k uvicorn.workers.UvicornWorker