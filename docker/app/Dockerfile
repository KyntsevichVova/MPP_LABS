FROM alpine:3 as base

WORKDIR /app
COPY ../../app-backend /app

FROM node:13.8.0 as build

COPY --from=base /app /app
RUN npm install && npm run build

FROM node:13.8.0 as release

COPY --from=base /app /app
COPY --from=build /app/build /app

RUN npm install --only=production 
RUN mkdir uploads

RUN node build/src/index.js