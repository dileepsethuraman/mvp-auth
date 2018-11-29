
// Build Redis host and port configuration variables
var REDIS_HOST = (process.env.REDIS_HOST) ? (process.env.REDIS_HOST) : '192.168.0.255' ;
var REDIS_PORT = (process.env.REDIS_PORT) ? (process.env.REDIS_PORT) : '6379' ;


// Build default Mongo Connection string
    var MONGO_URL = 'mongodb://172.17.0.2:27017/newdb';


module.exports = {
    REDIS_HOST,
    REDIS_PORT,
    MONGO_URL
};
