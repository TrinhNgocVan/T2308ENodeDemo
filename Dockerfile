FROM node:23-alpine
# FOLDER INSIDE IMAGE CONTAINER 
WORKDIR /app
# move file can thiet
COPY package*.json  ./
RUN npm install
COPY . . 

EXPOSE 3002

CMD [ "npm", "start" ]

