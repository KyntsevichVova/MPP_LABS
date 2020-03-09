# Install production dependencies
FROM node:13.8.0 as backend-deps

WORKDIR /app

COPY backend/package*.json /app/

RUN npm install --only=production

FROM node:13.8.0 as frontend-deps

WORKDIR /app

COPY frontend/package*.json /app/

RUN npm install --only=production

# Copy production deps, install other deps, build app
FROM node:13.8.0 as backend-build

WORKDIR /app

COPY --from=backend-deps /app /app
RUN npm install

COPY backend/tsconfig.json /app/
COPY backend/src /app/src/

RUN npm run build

FROM node:13.8.0 as frontend-build

WORKDIR /app

COPY --from=frontend-deps /app /app
RUN npm install

COPY frontend/public /app/public/
COPY frontend/tsconfig.json /app/
COPY frontend/src /app/src/

RUN npm run build

# Copy production deps, copy build artifact, prepare environment
FROM node:13.8.0 as release

WORKDIR /app

RUN mkdir uploads

COPY --from=backend-deps /app/node_modules /app/node_modules
COPY .env /app
COPY --from=backend-build /app/build /app/build
COPY --from=frontend-build /app/build /app/build/public