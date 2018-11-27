//#### THIS SCRIPT IS TO INITIALIZE REDIS AND MONGODB FOR THE PoC
//#### PRE-REQUISITES REDIS AND MONGODB MUST BE INSTALLED AND RUNNING. SET HOST/PORT INFORMATION
//#### APPROPRIATELY IN THE DECLARATIONS BELOW

//Include redis libraries and initialize client instance
var redis = require('redis');
let redisHost = 'ip-10-0-1-205.ap-southeast-2.compute.internal';
let redisPort = '6379'
const db = redis.createClient(redisPort,redisHost);

//Include mongoDB package for content storage
var MongoClient = require('mongodb').MongoClient;

//Declare URL to connect to mondoDB. Default port is 27017. Check this on server startup output
// We are connecting to default DB test. This needs to be changed for PROD
mongoURL = "mongodb://ip-10-0-1-245.ap-southeast-2.compute.internal:27017";


//Function to check if connectivity is okay
const checkConnection = () => {

	db.on('connect', function() {
    	console.log('Redis client connected successfully');
	});

	db.on("error", (err) => {

		if (err) {

			console.log("Connection to Redis failed " + err);	
		}
	
	});

	MongoClient.connect(
		mongoURL, 
		{
			native_parser: true,
			useNewUrlParser: true,
			connectTimeoutMS: 500
		}, 
		function(err, client) {

			
			if (err) {

				console.log('Connection to MongoDB failed. System error: ' + err);

			} else {

				console.log('Connection to MongoDB successful');
				client.close();

			}
		}
	)
}

//Check connectivity to Redis/MongoDB
checkConnection();
