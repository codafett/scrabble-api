FROM node:alpine AS build-stage

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# wherer available
COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

# Bundle app source
COPY . /app/

RUN npm run compile

FROM node:alpine AS prod

# Create app directory
# RUN mkdir /app
WORKDIR /app

COPY --from=build-stage /app/lib/ /app/lib/
COPY --from=build-stage /app/package.json /app/
COPY --from=build-stage /app/package-lock.json /app/
COPY --from=build-stage /app/.babelrc /app/

RUN npm i --production

# Define Commands
CMD [ "npm", "run", "start:prod" ]