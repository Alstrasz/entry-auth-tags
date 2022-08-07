# Description

This is a smiple project to pass entry test. It provides CRUD for working with User and Tag models. Includes local and jwt auth. Once user is logged in, he can create, modify or delete tags. Tags can be assigned to user and later retrieved at certain endpoints.

Description can be found at https://github.com/kisilya/test-tasks/tree/main/nodeJS

# Used technologies

- Postgres used as database

- NestJS used as backend framework

- Prisma as ORM

- Swagger at ```/api``` endpoint

- Jest for integration tests

# How to run

## With docker compose

For dev

From project's root folder:

- ```docker-compose up``` (can take a long time first time due to downloading of images and libraries)

Client will be available at http://127.0.0.1:3000

Postgres at 127.0.0.1:5432

Migration for prisma may be required

For prod docker-compose file should be modified

## With node

Requiers postgres to be launched, setting passed as env variables. See ./docker-compose.yml as example.

For pord

From project's root folder:
- ```npm i```
- ```npm run build```
- ```npm start```

For dev

Prisma migration may be requiered.
From project's root folder:
- ```npm i```
- ```npm run start:dev```

# How to test

Github actions has been created to run tests automatically on push \ pr to master

To test localy:

- ```npm i```
- ```npm test:local``` - launches postgres through docker-compose
OR
- ```npm test``` - requieres postgres url to be specified in .env.test
