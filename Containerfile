FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1 AS release
WORKDIR /app

COPY --from=base /app/.output ./.output

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
