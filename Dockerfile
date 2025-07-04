# Use Node 22.17.0 base image
FROM node:22.17.0-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies separately for Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose Vite's default port (but can vary)
# EXPOSE 9999

# Start Vite dev server and expose to host
CMD ["npm", "run", "dev", "--", "--host"]
