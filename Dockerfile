# ==============================================================================
# Unified Frontend & Gateway Dockerfile (100% Docker-contained, zero local tools)
# Builds both Client & Admin apps and serves them via nginx.conf at root
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Citizen Client (React + Vite)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS client-builder
WORKDIR /app

# Prevent ETIMEDOUT by increasing npm network retries and timeouts
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 600000

COPY client/package*.json ./
RUN npm ci --no-audit || npm install --no-audit

COPY client/ ./
ARG VITE_API_URL=/api/v1
ARG VITE_CLERK_PUBLISHABLE_KEY=""
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Build Civic Admin Portal (React + Vite)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS admin-builder
WORKDIR /app

# Prevent ETIMEDOUT by increasing npm network retries and timeouts
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 600000

COPY admin/package*.json ./
RUN npm ci --no-audit || npm install --no-audit

COPY admin/ ./
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_PATH=/admin/
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Unified Nginx Web Server
# ------------------------------------------------------------------------------
FROM nginx:alpine

# Copy the global root Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Place Citizen Client at web root (/)
COPY --from=client-builder /app/dist /usr/share/nginx/html

# Place Civic Admin at /admin subdirectory
COPY --from=admin-builder /app/dist /usr/share/nginx/html/admin

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
