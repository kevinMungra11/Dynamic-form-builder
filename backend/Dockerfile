FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port (adjust if needed)
EXPOSE 5000

# Start the backend
CMD ["npx", "ts-node", "server.ts"]
