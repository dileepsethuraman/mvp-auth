docker run --rm -d --name mongodb -p 27017:27017 mongo
node createEntries.js
docker run --rm -d --name testweb -p 3000:3001 build:1 npm start
