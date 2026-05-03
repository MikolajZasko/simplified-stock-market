# stage 1 - build the app
FROM node:22-alpine AS builder
WORKDIR /app

# copy package files and install dependencies
COPY package*.json ./
RUN npm install

# copy source code and build
COPY . .
RUN npm run build

# install postgresql-client - required for reset-db.sql
RUN apk add --no-cache postgresql-client

# stage 2 - run the app
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy only compiled code and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# copy the static and the views dir ???
COPY --from=builder /app/static ./static
COPY --from=builder /app/views ./views

# copy database info for drizzle
# drizzle.config.ts
COPY --from=builder /app/src/db/drizzle_configs/drizzle.config.ts ./src/db/drizzle_configs/drizzle.config.ts
# schema.ts
COPY --from=builder /app/src/db/schemas/schema.ts ./src/db/schemas/schema.ts

EXPOSE 3000
CMD ["node", "dist/index.js"]