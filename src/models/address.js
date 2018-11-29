// Include required modules
const mongoose = require('mongoose');
const log4js = require('log4js');

//Initialize logger configurations
const logger = log4js.getLogger();
logger.level = 'info';

// Create connection to MongoDB
const mongoClient = require("../classes/connect-mongo");

mongoClient.on('connected', () => {

	logger.info("MongoDB is ready");
});


// Instantiate schema
let Schema = mongoose.Schema;

let addressSchema = new Schema(

    {
        name: {type: String, required: true},
        street: {type: String, required: true},
        postcode: {type: Number, required: true}
    },
    {

        versionKey: false
    }

);

//  Error collection
mongoClient.on('error', (err) => {

    logger.fatal("Connection to MongoDB failed");
	return new Error('ERROR: ' + err);
});

mongoClient.on('disconnected', () => {

    logger.warn("Connection to MongoDB ended");
});

//Pass the collection name
module.exports = mongoClient.model('addresses', addressSchema);
