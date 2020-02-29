FROM alpine:3 as base

WORKDIR /app
COPY . /app

FROM node:13.8.0 as build

WORKDIR /app

COPY --from=base /app /app
RUN npm install && npm run build

FROM node:13.8.0 as release

WORKDIR /app

COPY --from=base /app /app
COPY --from=build /app/build /app/build

RUN npm install --only=production 
RUN mkdir uploads