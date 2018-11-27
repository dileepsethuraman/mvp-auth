// server.js

// Import modules & libraries
//const app1 = require("./src/modules/auth/app");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize express
const app = express();

// Initialize middleware
app.use(bodyParser.json());
app.use(cors());

// Create connection to Redis
const redisClient = require("./src/classes/connect-redis");

redisClient.on("ready", function() {
     console.log("Redis DB is ready");
});

// Create connection to MongoDB
const mongoClient = require("./src/classes/connect-mongo");

mongoClient.on('connected', () => {

	console.log("MongoDB is ready");
});


// Logging & Error Handling

redisClient.on("error", function(err) {
    
    return new Error('ERROR: ' + err);

});

redisClient.on("reconnecting", function(reply) {
    
    console.warn("Reconnecting: " + reply);
});

redisClient.on("end", function() {
    
    console.warn("Connection to Redis ended");
 
});

mongoClient.on('error', (err) => {

	return new Error('ERROR: ' + err);
});

mongoClient.on('disconnected', () => {

	console.warn("Connection to MongoDB has ended");
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
