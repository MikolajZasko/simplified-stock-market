# --- STAGE 1: Base ---
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- STAGE 2: Build ---
FROM base AS build
# Install ALL dependencies (including TypeScript compiler)
RUN npm ci
COPY . .
RUN npm run build

# --- STAGE 3: Production ---
FROM node:22-alpine AS production
WORKDIR /app

# Only copy production-ready files
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from the build stage
COPY --from=build /app/dist ./dist

# Security: Run as a non-root user
USER node

EXPOSE 3000
CMD ["node", "dist/index.js"]