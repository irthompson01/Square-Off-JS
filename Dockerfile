# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Expose the port the app runs on
EXPOSE 3000

# Step 7: Define the command to run the application
CMD [ "node", "server.js" ]
