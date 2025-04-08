FROM node:18-slim

# Install FFmpeg and dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libavcodec-extra \
    libavformat-dev \
    libavfilter-dev \
    libavdevice-dev \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Create required directories
RUN mkdir -p uploads public

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
