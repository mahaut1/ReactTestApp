#Create MySQL Image for JSP Tutorial Application
#pull official base image
FROM node:20

# Set the working directory
WORKDIR /app

#add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

# Add app
EXPOSE 3000
# Start app