ARG NODE_VERSION=11

###
# 1. Dependencies
###

FROM node:${NODE_VERSION}-slim as dependencies
WORKDIR /home/node/

RUN apt-get update
RUN apt-get install -y build-essential python
RUN npm install --global npm node-gyp

COPY package.json *package-lock.json *.npmrc ./

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}
RUN npm ci

###
# 2. Application
###

FROM node:${NODE_VERSION}-slim
WORKDIR /home/node/

COPY --from=dependencies /home/node/node_modules node_modules
COPY . .

ENV PATH="/home/node/node_modules/.bin:${PATH}"
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["node", "."]
