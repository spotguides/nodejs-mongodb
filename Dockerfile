ARG NODE_VERSION=11

###
# 1. Dependencies
###

FROM node:${NODE_VERSION}-slim as dependencies
WORKDIR /home/node/

RUN npm install --global npm node-gyp

COPY package.json *package-lock.json *.npmrc ./
RUN npm ci

###
# 2. Application
###

FROM node:${NODE_VERSION}-slim
WORKDIR /home/node/

COPY --from=dependencies /home/node/node_modules node_modules
COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["node", "."]
