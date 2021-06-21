FROM node:14.4.0-alpine3.10
WORKDIR /frontend
COPY package.json yarn.lock /frontend/
# Long timeout because some packages are large.
RUN yarn install --network-timeout 1000000
COPY . /frontend/

