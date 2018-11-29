// server.js

// Import modules & libraries
//const app1 = require("./src/modules/auth/app");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const log4js = require('log4js');
const goto = require('./src/routes/addressRoute')

// Initialize express
const app = express();

// Initialize middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize log parameters
const logger = log4js.getLogger();
logger.level = 'info';


// Create connection to Redis
const redisClient = require("./src/classes/connect-redis");

redisClient.on("ready", function() {
     logger.info("REDIS is ready");
});

// Route GET requests
app.route("/address")
    .get(goto.getAllAddress);

app.route("/address/:name")
    .get(goto.getAddressByID);


// Logging & Error Handling

redisClient.on("error", function(err) {
    
    logger.fatal('Connection to REDIS failed');
    return new Error('ERROR: ' + err);

});

redisClient.on("reconnecting", function(reply) {
    
    logger.warn('Attempting to reconnect to REDIS');
    console.warn("Reconnecting: " + reply);
});

redisClient.on("end", function() {
    
    logger.warn("Connection to REDIS closed");
 
});

app.listen(3001, () => {
	logger.info("Server running on port 3000");
});

module.exports = app;