# Development Dockerfile for React + TypeScript frontend
# This version supports hot-reloading for local development

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
# Note: package.json will be created by Paul in FRONTEND-02
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for Vite/CRA dev server
EXPOSE 3000

# Start development server with hot-reloading
# This will be updated once Paul chooses Vite or CRA
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
