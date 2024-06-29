# Bull Board Dockerized

![Docker Pulls](https://img.shields.io/docker/pulls/nauverse/bull-board)

This is a production-ready, heavily optimized, Docker image for [bull-board](https://github.com/felixmosh/bull-board). It allows you to monitor your bull queues without coding a web server just for that, just launch the Docker image!

It supports `bull` and `bullmq`.

## Features

- 🔒 **Optional auth integrated**: I implemented some `Basic` auth to secure the dashboard.
- ⚡ **Ultra performant**: Behind the scenes it only has a `distroless` image that launches a tiny fast web server with the Bull Board.
- 🔧 **Configurable**: There are several `.env` config options allowing you to customize the behavior of your image.
- 👮 **Secure**: Auth, logging, CSP headers... everything integrated to improve your deployment (just remember, security is not guaranteed, you have to do your own work on that!)

## Quick start with Docker

```bash
docker run -p 3000:3000 nauverse/bull-board
```

This code will expose the webserver on `localhost:3000`. It will also try to connect to your Redis instance on `localhost:6379` (without any password, read below for more settings).

## Quick start with Docker Compose

```yaml
bullboard:
  container_name: bullboard
  image: nauverse/bull-board
  restart: unless-stopped
  pull_policy: always
  ports:
    - "3000:3000"
```

This `docker-compose.yaml` file will launch the image and expose it at `localhost:3000`. Again, it will try to connect to your Redis instance on `localhost:6379`.

## Environment variables

- `REDIS_URL` - [Optional] A Redis URL with any connection param you need. By default it uses `redis://localhost:6379`.
- `BULL_PREFIX` - [Optional] Used to prefix your bull queue name. By default it uses `bull`.
- `BULL_VERSION` - [Optional] Version of the Bull lib to use. It can be `BULLMQ` or `BULL`. By default it is `BULLMQ`.
- `BASE_PATH` - [Optional] The base URL where the internal web server will expose the board and all its resources. By default it is `/`.
- `LOG_LEVEL` - [Optional] The minimum log level to display. It can be `trace`, `debug`, `info`, `warn`, `error`, `fatal`. By default it is `info`.
- `LOG_ANONYMIZE_IP` - [Optional] A boolean to determine if the web server should anonymice any IP found in the request logs (for privacy complaint). By default it is `false`.
- `USER_USERNAME` - [Optional] A string containing the username used to identify the user. If added, you must also specify the `USER_PASSWORD` env var. If any of those are not set, the auth won't be enabled. By default it is not set.
- `USER_PASSWORD` - [Optional] A string containing the passoword used to identify the user. If added, you must also specify the `USER_USERNAME` env var. If any of those are not set, the auth won't be enabled. By default it is not set.

## Complete example with `docker-compose.yaml`

### `docker-compose.yaml`

```yaml
services:
  redis:
    container_name: redis
    restart: unless-stopped
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
    image: redis:6
    ulimits:
      memlock: -1
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command:
      [
        "redis-server",
        "--requirepass",
        "${REDIS_PASSWORD}",
        "--maxmemory-policy",
        "noeviction",
      ]
    healthcheck:
      test:
        - CMD-SHELL
        - "redis-cli -a $${REDIS_PASSWORD} ping"
      interval: 5s
      timeout: 20s
      retries: 10

  bullboard:
    container_name: bullboard
    image: nauverse/bull-board
    restart: unless-stopped
    pull_policy: always
    ports:
      - "3000:3000"
    environment:
      REDIS_URL: ${REDIS_URL}
      BULL_PREFIX: bull
      USER_USERNAME: ${BULL_BOARD_AUTH_USER}
      USER_PASSWORD: ${BULL_BOARD_AUTH_PASSWORD}
      LOG_ANONYMIZE_IP: "true"
    depends_on:
      - redis

volumes:
  redis_data:
```

### `.env`

```
REDIS_PASSWORD=supersecurepassword
REDIS_URL=redis://default:${REDIS_PASSWORD}@redis:6379
BULL_BOARD_AUTH_USER="mysupersecretusername"
BULL_BOARD_AUTH_PASSWORD="anothersupersecurepassword"
```

Then launch it with:

```bash
docker compose up -d
```

And stop it with:

```bash
docker compose down
```

## TODO

- Allow setting the uiConfig optional parameters using the `.env` file
- Create tests for the HTTP server
- Improve the documentation
- Deploy it as a a single-file standalone executable (using the `bun` [compile option](https://bun.sh/docs/bundler/executables)). I need to wait for that since `bun` does not export `node_modules` into the binary (yet) [https://github.com/oven-sh/bun/issues/8967](https://github.com/oven-sh/bun/issues/8967).

## Notes

Do not compile it to a single standalone executable with the `--minify` param since it breaks the internal code.
