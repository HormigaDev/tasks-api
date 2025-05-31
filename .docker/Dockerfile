FROM node:24-slim

WORKDIR /app

COPY .. .

RUN npm ci
RUN npm run build

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["bash", "/app/.docker/init.sh"]
