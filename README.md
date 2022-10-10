
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Set up the app

```bash

# Install dependencies
$ yarn install

# Create and run docker container with postgres
$ yarn run docker:container:db

# Create file with env vars
$ Create .env file

# Create database in postgres docker container
# To create a database, follow the instructions "Create a database"
$ Create database "development_db_viom"

# Generate config for db based on .env file
$ yarn run build-ormconfig

# Run migrations
$ yarn typeorm:run

# Start the app
$ yarn start
```

## Create a database

```bash
# After running your postgres docker container we can connect to it
# Check your container ID by command "docker ps" and find container with name "viom-postgres"
$ docker exec -it {{YOUR_CONTAINER_ID}} bash

$ psql -U postgres

# Create a database
$ CREATE DATABASE development_db_viom;

# Check on exist our database
$ \l
```
