<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Project to evaluation.

## Installation

Make sure you have a local instance of the following services below and their respective credentials or changes in the environment (.env) file:

- MongoDB

- RabbitMQ

## Technologies

- Node.js
- Nest.js
- MongoDB
- RabbitMQ

## Running the app

```bash

# install dependencies
$ npm install

# watch mode
$ npm run start:dev

```

## Test

```bash
# tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Endpoints

- POST /api/users
<p align="left">
  <img src="https://i.ibb.co/Yff1kPf/create-user.png" width="500" /></a>
</p>

DTO errors
<p align="left">
  <img src="https://i.ibb.co/qDrgFpq/create-user-dto.png" width="500" /></a>
</p>

<p align="left">
  <img src="https://i.ibb.co/syd7YY5/create-user-mongo.png" width="500" /></a>
</p>

- GET /api/user/{userId}
<p align="left">
  <img src="https://i.ibb.co/prH6M7j/find-user.png" width="500" /></a>
</p>

User Not Found
<p align="left">
  <img src="https://i.ibb.co/871MqR0/find-user-not-found.png" width="500" /></a>
</p>

- GET /api/user/{userId}/avatar

First Execution
<p align="left">
  <img src="https://i.ibb.co/ncHj0KV/find-avatar-by-user-first-execution.png" width="500" /></a>
</p>

Second Execution
<p align="left">
  <img src="https://i.ibb.co/19n8jPK/find-avatar-by-user-second-execution.png" width="500" /></a>
</p>

User not found
<p align="left">
  <img src="https://i.ibb.co/gJYg45R/find-avatar-by-user-first-execution-not-found.png" width="500" /></a>
</p>

Mongo
<p align="left">
  <img src="https://i.ibb.co/Ybb7NR0/find-avatar-by-user-mongo.png" width="500" /></a>
</p>

open converted Base64
<p align="left">
  <img src="https://i.ibb.co/d0fcd55/teste-open-base64-image.png" width="500" /></a>
</p>


- DELETE /api/user/{userId}/avatar

<p align="left">
  <img src="https://i.ibb.co/5LjFdjb/delete-avatar-by-user.png" width="500" /></a>
</p>


<p align="left">
  <img src="https://i.ibb.co/q79S5YZ/delete-avatar-by-user-mongo.png" width="500" /></a>
</p>


## Done

- Your project passes eslint / prettier format

<p align="left">
  <img src="https://i.ibb.co/q794wsd/eslint.png" width="500" /></a>
</p>

<p align="left">
  <img src="https://i.ibb.co/cFBmbP5/prettier-format.png" width="500" /></a>
</p>

- The project builds and can start: "Running the app" guide

- All endpoints can be requested from postman: Available link to download collection: https://1drv.ms/u/s!AkdSjBhQnhatpxTHYgF13b3FJAyu?e=4U3k1g

- Data is stored in database successfully and rabbit event is emitted:

Mongo: Accompanied by its respective endpoint above

RabbitMQ Messages

<p align="left">
  <img src="https://i.ibb.co/XZbWYqD/rabbitmq-receive-message.png" width="500" /></a>
</p>

Mailtrap Mail

<p align="left">
  <img src="https://i.ibb.co/vZvSvyV/mailtrap.png" width="500" /></a>
</p>

- Your application is covered with unit/functional tests

Coverage Files (Coverage of entity files changed, because some of their attributes were strategically used as needed when being instantiated)

<p align="left">
  <img src="https://i.ibb.co/rHd3rwf/coverage-files.png" width="500" /></a>
</p>

## Support

- Author - Diego Mota Christ
- diego.christ@outlook.com
- t.me/diego_christ
