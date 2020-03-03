# Install production dependencies
FROM node:13.8.0 as deps

WORKDIR /app

COPY package*.json /app/

RUN npm install --only=production

# Copy production deps, install other deps, build app
FROM node:13.8.0 as build

WORKDIR /app

COPY --from=deps /app /app
RUN npm install

COPY ./build_tools /app/build_tools/
COPY tsconfig.json /app/
COPY ./src /app/src/

RUN npm run build

# Copy production deps, copy build artifact, prepare environment
FROM node:13.8.0 as release

WORKDIR /app

RUN mkdir uploads

COPY --from=deps /app /app
COPY .env /app
COPY --from=build /app/build /app/build