//#### THIS SCRIPT IS TO INITIALIZE REDIS AND MONGODB FOR THE PoC
//#### PRE-REQUISITES REDIS AND MONGODB MUST BE INSTALLED AND RUNNING. SET HOST/PORT INFORMATION
//#### APPROPRIATELY IN THE DECLARATIONS BELOW

//Include redis libraries and initialize client instance
var redis = require('redis');
let redisHost = process.env.REDIS_HOST;
let redisPort = process.env.REDIS_PORT;
const db = redis.createClient(redisPort,redisHost);

//Include mongoDB package for content storage
var MongoClient = require('mongodb').MongoClient;

//Declare URL to connect to mondoDB. Default port is 27017. Check this on server startup output
// We are connecting to default DB test. This needs to be changed for PROD
mongoURL = process.env.MONGO_CONNECTION_STRING;

//This is library that flattens an objects. i.e., if there is a mutli-nested object
// it will flatten it to one-level deep
// This is recommended for storing JSON like object in REDIS
//const flatten = require('flat');

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

//Function to create a test entry in Redis
createTestEntry = () => {

//Check connectivity to Redis/MongoDB
checkConnection();

db.flushdb((err,res) => {

	if (err) {

			console.log('Redis flush failed: ' + err);

	} else {

			console.log('Redis flush completed: ' + res);
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

			var db = client.db('test');

			if (err) 
			{

				console.log('Connection to MongoDB failed. System error: ' + err);

			} else {

				//Since connection is successful, insert the data into the DB
				db.collection('projectarc').deleteMany({}, (err,result) => {

					if (err) {

						//Calling the callback function (reportStatus). The first parameter is error, second is something
						// you want to pass to the callback function
						console.log('MongoDB flush failed. System error: ' + err);
						client.close();

					} else {

						//Calling the callback function (reportStatus). The first parameter is error, second is something
						// you want to pass to the callback function
						console.log('MongoDB flush successful. System message: ' + err);
						client.close();
					}

				});

			}

		});


// db.hmset("user:dileep", ["password", "dileep", "otherinfo", "miscellaneous"], (err, res) => {

// 		// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
// 		// declare multiple key value pairs for it
// 		if (err) {
// 			console.log(`Redis insert error` + err);
// 		}

// 	});

// User information template
db.hmset(

		//User ID
		//This is the hash key
		//Value - String
		"userId:des@g", 
		
		// User password
		// Value - String. Needs to be encryped. TBD.
		"userPassword",
		"righto", 

		// Currently active arcs that the user is participating in
		// Value - should be a list. TBD.
		"activeArcs",
		"list",
		(err, res) => {

		// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
		// declare multiple key value pairs for it
		if (err) {
			console.log(`Redis insert error` + err);
		}

	});

// User information template
db.hmset(

		//User ID
		//This is the hash key
		//Value - String
		"userId:abc@g", 
		
		// User password
		// Value - String. Needs to be encryped. TBD.
		"userPassword",
		"righto", 

		// Currently active arcs that the user is participating in
		// Value - should be a list. TBD.
		"activeArcs",
		"list",
		(err, res) => {

		// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
		// declare multiple key value pairs for it
		if (err) {
			console.log(`Redis insert error` + err);
		}

	});

//Counter for creating arc IDs
db.hmset("last", "counter", 0 , (err, res) => {

		// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
		// declare multiple key value pairs for it
		if (err) {
			console.log(`Redis insert error` + err);
		}

	});

//List of Active Arcs in the system
db.hmset("active", "arcs", '' , (err, res) => {

		// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
		// declare multiple key value pairs for it
		if (err) {
			console.log(`Redis insert error` + err);
		}

	});


//Template for arc properties
db.hmset(

		//Unique arc id
		//This is the hash key
		//Contructed as : `arc:meta:` followed by the incremented value of key counter from hash last
		"arc:0:props", 

		//The title of the arc,
		//String value.
		"title",
		"undefined",

		//The creator of the arc,
		//user should already exist
		//String value.
		"owner",
		"undefined",

		//State of the Arc.
		// Values - active, suspended, complete, published
		// String value
		"state",
		"active",

		//The genre selected by the arc owner
		// String value
		"genre",
		"undefined",

		//The subgenre selected by the arc owner
		//String value
		"subgenre",
		"undefined",

		//The number of contributors for the arc, selected by the arc owner
		// Integer value
		"contributors",
		0,

		// The number of chapters allowed in the arc, selected by the arc owner,
		// Integer value
		"chapters",
		0,

		// The total number of words permissible in the arc, selected by the arc owner,
		// Integer value
		"totalwords",
		0,

		// The abstract selected by the arc owner,
		// String value
		"preface",
		"undefined",


		(err, res) => {

			// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
			// declare multiple key value pairs for it
			if (err) {
				console.log(`Redis insert error` + err);
			}

	});

//Chapter meta template
db.hmset(

		//Unique arc id
		//This is the hash key
		//Contructed as : `chapters:arc:meta:` followed by the incremented value of key counter from hash last
		"arc:0:chapter:1", 


		//The title of the first chapter
		//String value. Non mandatory.
		"title",
		"undefined",

		//The contributor of the first chapter
		// String value - user ID. Should have been pre-created
		"owner",
		"undefined",

		(err, res) => {

			// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
			// declare multiple key value pairs for it
			if (err) {
				console.log(`Redis insert error` + err);
			}

	});


// Pre-commit store during editing
db.hmset(

		//Unique arc id
		//This is the hash key
		//Contructed as : `chapters:arc:meta:` followed by the incremented value of key counter from hash last
		"arc:0:precommit",


		//The title of the first chapter
		//String value. Non mandatory.
		// The chapter information is created here before committing to arc:0:chapters
		"title",
		"undefined",

		//The contributor of the first chapter
		// String value - user ID. Should have been pre-created
		// The chapter information is created here before committing to arc:0:chapters
		"owner",
		"undefined",


		(err, res) => {



			// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
			// declare multiple key value pairs for it
			if (err) {
				console.log(`Redis insert error` + err);
			}

		});


// Meta data about the ongoing arc
db.hmset(

		//Unique arc id
		//This is the hash key
		//Contructed as : `chapters:arc:meta:` followed by the incremented value of key counter from hash last
		"arc:0:meta",

		// Placeholder for the last edited and committed chapter
		// This information is created here before being committed to arc:0:props
		"lastchapter",
		0,

		//A real-time count of the total number of words in the Arc
		//For literary works only
		// Integer value
		"numberofwords",
		0,

		//The position in the queue that the arc is currently on
		// Integer value
		"queueactiveslot",
		0,

		//The present state of the queue.
		// Values -
		// open - still room for members to join,
		// closed - queue at maximum number of permissible people
		"queuestate",
		"open",

		//A list of queuemembers registered for the arc
		// List value
		"queuemembers",
		"list",


		(err, res) => {



			// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
			// declare multiple key value pairs for it
			if (err) {
				console.log(`Redis insert error` + err);
			}

		});

// Queue information on the ongoing arc
db.hmset(

		//Unique arc id
		//This is the hash key
		//Contructed as : `chapters:arc:meta:` followed by the incremented value of key counter from hash last
		"arc:0:queue:1",


		//Details of the user occupying the first slot of the queue
		// The user information must be pre-existing
		"userid",
		"undefined",


		(err, res) => {



			// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
			// declare multiple key value pairs for it
			if (err) {
				console.log(`Redis insert error` + err);
			}

		});

//Insert here

}

createTestEntry();

db.quit();