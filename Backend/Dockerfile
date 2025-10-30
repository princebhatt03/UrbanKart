# Use an official Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your backend files
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
