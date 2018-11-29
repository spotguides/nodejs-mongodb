# Spotguide for Node.js with MongoDB database

This repository was created by Banzai Cloud Pipeline. Spotguides provide automated configuration, logging, monitoring, security, and scaling for your application stacks.

<!-- TOC -->

- [Spotguide for Node.js with MongoDB database](#spotguide-for-nodejs-with-mongodb-database)
  - [Development](#development)
    - [Local development](#local-development)
      - [Deploy to a local Kubernetes cluster](#deploy-to-a-local-kubernetes-cluster)
      - [Run tests](#run-tests)
      - [Start application in development mode](#start-application-in-development-mode)
    - [Kubernetes ready Node.js](#kubernetes-ready-nodejs)
  - [Environment variables](#environment-variables)
  - [Endpoints](#endpoints)
    - [`GET /`](#get)
    - [`GET /metrics`](#get-metrics)
    - [`GET /healthy`](#get-healthy)
    - [`GET /ready`](#get-ready)
    - [`GET /api/v1/users`](#get-apiv1users)
    - [`POST /api/v1/users`](#post-apiv1users)
    - [`GET /api/v1/users/:id`](#get-apiv1usersid)
    - [`PUT /api/v1/users/:id`](#put-apiv1usersid)
    - [`DELETE /api/v1/users/:id`](#delete-apiv1usersid)

<!-- /TOC -->

## Development

Every time you make changes to the source code and update the `master` branch, the CI/CD pipeline will be triggered to test, validate and update the deployment of your application. Check the [`.pipeline.yaml`](.banzaicloud/pipeline.yaml) file for CI/CD steps.

### Local development

#### Deploy to a local Kubernetes cluster

_Requirements:_

- [Docker](https://www.docker.com/)
- [Docker for Desktop](https://www.docker.com/products/docker-desktop)
- [skaffold](https://github.com/GoogleContainerTools/skaffold) and its dependencies

A local Kubernetes cluster must be running (eg. [Docker for Desktop](https://www.docker.com/products/docker-desktop)).

```sh
# verify the Kubernetes context
$ kubectl config get-contexts
# expected output
CURRENT   NAME                 CLUSTER                      AUTHINFO             NAMESPACE
*         docker-for-desktop   docker-for-desktop-cluster   docker-for-desktop
# build the Docker image and deploy via helm
$ cd .banzaicloud
$ skaffold run
```

This will build the application and install all the components to Kubernetes.

#### Run tests

Using installed Node.js:

_Requirements:_

- [Node.js](https://nodejs.org/)

_Commands:_

```sh
npm install
npm test
```

Using Docker:

_Requirements:_

- [Docker](https://www.docker.com/)

_Commands:_

```sh
docker build . -t spotguide-nodejs-mongodb
docker run -it --rm -v $(pwd):/home/node/ spotguide-nodejs-mongodb npm test
```

#### Start application in development mode

Uses [nodemon](https://nodemon.io/), it is a utility that will monitor for any changes in your source and automatically restart your server.

Using local Node.js and MongoDB:

_Requirements:_

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

_Commands:_

```sh
# MongoDB must be running, set environment variables in .env or start dependencies
# docker-compose up -d
npm install
npm run start:dev
```

Using Docker and Docker Compose:

_Requirements:_

- [Docker](https://www.docker.com/)

_Commands:_

```sh
# start dependencies
docker-compose up -d
# build image
docker build . -t spotguide-nodejs-mongodb
# start application in development mode
docker run -it --rm -v $(pwd):/home/node/ spotguide-nodejs-mongodb npm run start:dev
```

### Kubernetes ready Node.js

Our [`npm` library](https://github.com/banzaicloud/node-service-tools) provides all the essential features to prepare your Node.js application truly ready for production on Kubernetes, such as:

- graceful error handling & shutdown
- structured JSON logging
- various HTTP middleware
- health checks
- metrics

Read more about it in our [blog post](https://banzaicloud.com/blog/nodejs-in-production/).

## Environment variables

| name               | description                                                                                                                   | default     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `PORT`             | Application port                                                                                                              | 3000        |
| `MONGODB_URI`      | MongoDB URI, scheme: `mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]` |             |
| `MONGODB_HOST`     | MongoDB host                                                                                                                  | '127.0.0.1' |
| `MONGODB_PORT`     | MongoDB port                                                                                                                  | 27017       |
| `MONGODB_USERNAME` | MongoDB user                                                                                                                  |             |
| `MONGODB_PASSWORD` | MongoDB user password                                                                                                         |             |
| `MONGODB_DATABASE` | MongoDB database name                                                                                                         |             |

## Endpoints

These are the implemented REST endpoints in the sample application.

### `GET /`

Root endpoint, returns basic [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) information, like name, namespace and image.

### `GET /metrics`

[Prometheus](https://prometheus.io) metrics endpoint.

### `GET /healthy`

Health check, liveness probe endpoint. Returns `200` when the application is healthy, can reach the database.

### `GET /ready`

Readiness probe endpoint. Returns `200` when the application is ready to accept requests.

### `GET /api/v1/users`

Fetch all users.

### `POST /api/v1/users`

Create a new user. The request body has the following schema:

```json
{
  "email": "",
  "username": "",
  "firstName": "",
  "lastName": ""
}
```

### `GET /api/v1/users/:id`

Fetch a user.

### `PUT /api/v1/users/:id`

Update a user. The request body has the same schema as [`POST /api/v1/users`](#post-apiv1users).

### `DELETE /api/v1/users/:id`

Delete a user.
