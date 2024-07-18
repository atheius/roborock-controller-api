# Roborock Controller

An API interface for a Roborock vacuum cleaner.

This project was designed as a very simple interface to provide some basic controls without having to use the Roborock mobile app. It allows me to run HTTP requests from other smart devices (e.g. buttons etc.) to control the device.

This project was created using the [fastify-cli](https://github.com/fastify/fastify-cli).

## Install

```sh
npm install
```

## Setup

Create a `.env` file in the root directory of the project e.g.

```
DEVICE_ADDRESS=0.0.0.0
DEVICE_TOKEN=11111111111111111111111111111111
```

The device token can be obtained using [this tool](https://github.com/Maxmudjon/Get_MiHome_devices_token).

## Auth

You can enable basic auth with the following env vars:

```
AUTH_ENABLED=true
AUTH_USERNAME=username
AUTH_PASSWORD=password
```

## Bin Schedule

I added the option of a bin schedule to allow me to easily empty the device after cleaning has run.

You can enable a bin schedule with a cron e.g.

```
BIN_SCHEDULE_ENABLED=true
# The location of the bin (requires some trial an error to find grid coordinates!)
BIN_TARGET=10000,10000
# Go to the bin target at 7am every day...
BIN_SCHEDULE_CRON=0 7 * * *
```

## Run

Run the API:

```
npm run dev
```

## Examples

Some examples of using the API...

```sh
# Go to dock
curl --request GET 'localhost:3000/go/dock'
```

```sh
# Go to bin
curl --request GET 'localhost:3000/go/bin'
```
