FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git and required dependencies
RUN apk add --no-cache git

# Copy package manifests first for optimal Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy application source code
COPY . .

# Ensure upload directory exists
RUN mkdir -p public/temp && chmod -R 777 public/temp

# Default port
ENV PORT=8000
EXPOSE 8000

# Start backend server
CMD ["node", "src/index.js"]
