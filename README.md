# Roborock Controller

Create a web API wrapper to controll a Roborock vaccum.

This project was created using [fastify-cli](https://github.com/fastify/fastify-cli).

## Install

```sh
npm install
```

## Test

```sh
npm test
```

## Run

Create a `.env` file in the root directory of the project e.g.

```
DEVICE_ADDRESS=0.0.0.0
DEVICE_TOKEN=11111111111111111111111111111111
BIN_TARGET=10000,10000
```

Run server:

```
npm run dev
```

## API

```
# Go to dock
curl --request GET 'localhost:3000/go/dock'
```

```
# Go to bin
curl --request GET 'localhost:3000/go/bin'
```
