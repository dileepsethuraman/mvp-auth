
// Build Redis host and port configuration variables
var REDIS_HOST = (process.env.REDIS_HOST) ? (process.env.REDIS_HOST) : 'locahost' ;
var REDIS_PORT = (process.env.REDIS_PORT) ? (process.env.REDIS_PORT) : '6379' ;


// Check if the required environment variables are set
if (process.env.MONGO_USER && process.env.MONGO_PASSWORD && process.env.MONGO_HOST  && process.env.MONGO_PORT && process.env.MONGO_DB_NAME ) {

    // Build the Mongo Connection string. encodeURIComponent is used to escape all special characters
    var MONGO_URL = 'mongodb://' + process.env.MONGO_USER + ':' + encodeURIComponent(process.env.MONGO_PASSWORD) + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME;

} else {
    // Build default Mongo Connection string
    var MONGO_URL = 'localhost:27017';
}


module.exports = {
    REDIS_HOST,
    REDIS_PORT,
    MONGO_URL
};
