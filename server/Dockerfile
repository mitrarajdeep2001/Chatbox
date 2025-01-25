# Base image: Ubuntu latest LTS version
FROM ubuntu:22.04

# Set the working directory
WORKDIR /usr/src/server

# Install required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    && apt-get clean

# Install Node.js (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Expose ports
EXPOSE 3000
EXPOSE 5555

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Run Prisma migrate dev before starting the server
# RUN npm run prisma

# Run Prisma generate before starting the server
# RUN npm run prisma-generate

CMD ["npm", "run", "dev"]
