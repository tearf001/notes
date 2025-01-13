# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
# Install dependencies using Yarn
RUN npm config set registry https://registry.taobao.org
RUN npm install --frozen-lockfile

COPY . .

RUN npm build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]