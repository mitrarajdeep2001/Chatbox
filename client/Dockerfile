# Base image, use the latest LTS Node.js version
FROM node:lts

# Set the working directory
WORKDIR /usr/src/client

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the development server port
EXPOSE 5173

# Start the client application
CMD ["npm", "run", "dev"]
