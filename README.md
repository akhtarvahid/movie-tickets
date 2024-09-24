# Introduction
Sample backend application and REST-API with Nestjs, Docker, Postgres, Elasticsearch and Kibana.

## Usage

#### Clone project
```bash
git clone https://github.com/akhtarvahid/movie-tickets.git
```

#### Install Dependencies
Run command below for install npm packages:
```bash
npm i
```

Run command below for pull and run Docker images:
```bash
docker-compose up -d
```

#### Environment
Create **.env** file like [.env.sample](https://github.com/akhtarvahid/movie-tickets/blob/master/.env.sample)

#### Running the app
- development
```bash
npm run start
```
- watch mode
```bash
npm run start:dev
```
- production mode
```bash
npm run start:prod
```

## URLs(Local)
- [Swagger](http://localhost:3000/api/)
- [pgAdmin](http://localhost:8080/)
- [Kibana](http://localhost:5601/)
- [Elasticsearch](http://localhost:9200/)

## Technologies
- NestJs
- Typescript
- Docker
- Elasticsearch
- Kibana
- Postgres
- pgAdmin
- Typeorm
- Swagger


## License

Nest is [MIT licensed](LICENSE).
