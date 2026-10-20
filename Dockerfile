# Build the static site with Bun. The image has no Node.js, so `--bun` runs Astro on Bun.
FROM oven/bun:1.3.13-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# Fail the image build when a page links a file that is not in dist/.
RUN bun --bun run build && bun test ./tests

FROM nginxinc/nginx-unprivileged:1.29.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build --chown=nginx:nginx /app/dist/ /usr/share/nginx/html/

EXPOSE 8080
