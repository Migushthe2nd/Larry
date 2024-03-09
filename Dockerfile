FROM node:18 AS build-env

WORKDIR /usr/src/app

# Environment variables for production
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm install

COPY . .

RUN pnpm prune --prod
ENV NODE_ENV=production

# currently just running with src still in the container instead of copying dist to a new container:
# can't get tsc to copy assets (json, images, emails) to dist
CMD pnpm run dev