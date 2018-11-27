// redisDemo.js
var redis = require('redis');
var client = redis.createClient(); // this creates a new client

const fcheckConnection = () => {

	client.on('connect', function() {
    console.log('Redis client connected');
	});

	client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
}

fcheckConnection();

client.get('name', function (error, result) {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log('GET result ->' + result);
});