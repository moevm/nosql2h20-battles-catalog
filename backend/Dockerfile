FROM python:3.6

RUN apt-get update && apt-get upgrade -y

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install -U pip setuptools && pip install -r /app/requirements.txt

WORKDIR /app/
COPY ./app /app/app

EXPOSE 3030

CMD gunicorn app:app --bind=0.0.0.0:3030 -w 4 -k uvicorn.workers.UvicornWorker