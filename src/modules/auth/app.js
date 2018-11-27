// This file has to be manually created
//In the package.json file, momentarily we are
// running nodemon to run off this file 

//Include express libraries and instantiate into a variable
const express = require('express');
const app = express();

//Include the body parser
const bodyParser = require('body-parser');

//Include cors package
const cors = require('cors');

//Include mongoDB package for content storage
var MongoClient = require('mongodb').MongoClient;

// Build the Mongo Connection string. encodeURIComponent is used to escape all special characters
mongoURL = 'mongodb://' + process.env.MONGO_USER + ':' + encodeURIComponent(process.env.MONGO_PASSWORD) + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME

//Include assert package for sanity checking DB connections and transactions
const assert = require('assert');

//This is to tell app parse incoming parameters to JSON using body parser
//Body parser is "middleware" - Suggest readup of additional middlewares for express
app.use(bodyParser.json());
//Also include cors middlware
app.use(cors());

//Include redis libraries and initialize client instance
var redis = require('redis');
let redisHost = process.env.REDIS_HOST;
let redisPort = process.env.REDIS_PORT;
const db = redis.createClient(redisPort,redisHost);

//This is library that flattens an objects. i.e., if there is a mutli-nested object
// it will flatten it to one-level deep
// This is recommended for storing JSON like object in REDIS
const flatten = require('flat');

// Import function for setting Arc properties
const createarc = require('./createarc'); 

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

checkConnection();

//Global variables
//

// Get the user properties
app.get('/userarcs/:userId', (req,res) => {

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arcs:` + err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				res.status(200).json(data);


			}
				
		}


		console.log('DEBUG : Starting to fetch user arcs');

		const { userId } = req.params;

		console.log(`The user ID is:` + userId);

		// Call a function from the imported library to fetch user arcs and send response to client in JSON
		createarc.fetchUserArcs(userId, sendResponse);

	}

)

// Get the properties of an arc
app.get('/arcprops/:arcId', (req,res) => {

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arcs:` + err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				res.status(200).json(data);


			}
				
		}

		//De-construct and assign variables from recieved parameters
		const { arcId } = req.params;


		console.log('DEBUG : Starting to fetch arc properties for arc '+ arcId);


	createarc.fetchArcProps(arcId, sendResponse);

	}

)



// We are getting sent a JSON from the client
app.post('/signin', (req,res) =>{

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arcs:` + err);
				res.status(401).json('Login failed');

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				res.status(200).json(data);


			}
				
		}

		console.log('DEBUG: Recieved username is ' + req.body.username);

	 	console.log('DEBUG: Receieved password is ' + req.body.password);
		
		// This is the callback function
		const checkPassword = (err, data) => {

			if (err) {

				console.log ('DEBUG: Errored inside checkPassword: ' + err);
				sendResponse(err, null);

			} else {

				if (req.body.password && req.body.password.toString() === data)
				{
					console.log ('DEBUG: Password match');
					sendResponse(null,'Password has matched');

				} else {

					console.log ('Password mismatch');
					sendResponse('Password mismatch',null);
				}

			}

		};

		//This is the calling function
		const fetchPassword = (callback) => {

			// Build the hash from the incoming username
			const userHash = `userId:` + req.body.username;

			if (req.body.username) {

				//Get all the information for a key
				db.hgetall(userHash, (err,reply) => {

					if (err) {

						console.log('Failed to fetch password for hash: ' + userName + '. Error: ' + err);

					} else {
				
						//console.log('DEBUG: The password is ' + reply.password.toString());
                        if (reply) {

	                            //Calling the callback function (checkPassword). The first parameter is error, second is something
	                            // you want to pass to the callback function
	                            callback(null, reply.userPassword.toString());


                            } else {

                            	callback('Null password fetched. End processing loop.',null);

                            }


					}
				});

			} else {
				callback('No username was passed', null);
			}


	}

	 	//The calling function is fetchPassword, which will callback checkPassword
	 	// This will verify send password with the one stored in Redis
	 	fetchPassword(checkPassword);
});

// We are getting sent a JSON from the client
// Error handling needs to to be added to catch 500 messges and decrement counter
app.post('/createarc', (req,res) =>{

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arcs:` + err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				res.status(200).json(data);


			}
				
		}

	// This is the calling function to increment the arc counter
	const incrArcCount = (callback) => {

			db.hincrby("last","counter", 1, (err,reply) => {

			if (err) {

				console.log('DEBUG: Counter increment failed - ' + err);
				res.status(400).json(`DEBUG: Counter increment failed`);
			} else {
				console.log('DEBUG: Counter incremented to - ' + reply);

				//build the arc hash
				callback('arc:' + reply);
				res.status(200).json(`DEBUG: Props request sent to Redis. Need error handling to check if Redis has processed successfully`);
			}

		});
	}

	//This is the called function, to send the arc property details to Redis
	const setArcprops = (arcid) => {
			// console.log('DEBUG: Recieved subgenre: ' + req.body.subgenre);
			// console.log('DEBUG: Recieved contributors: ' + req.body.constributors);
			// console.log('DEBUG: Recieved chapters: ' + req.body.chapters);
			// console.log('DEBUG: Recieved totalwords: ' + req.body.totalwords);
			// console.log('DEBUG: Recieved groundingline: ' + req.body.groundingline);
			// console.log('DEBUG: Recieved selectedgenre: ' + req.body.selectedgenre);

			// Build the userName from the login ID
			const userName = req.body.username;
			
			createarc.setArcProps(
					arcid,
					req.body.title,
					userName, 
					"active",
					req.body.selectedgenre,
					req.body.subgenre,
					req.body.constributors,
					req.body.chapters,
					req.body.totalwords,
					req.body.groundingline
				);
		 	console.log('Err is:');
	}

	console.log('The response is:' + res);

	//Call the functions
	incrArcCount(setArcprops);

});

// This is a method to add a new user to the arc queue
app.post('/addtoqueue', (req,res) =>{


		const userName = req.body.username;
		const arcId = req.body.arcid;
		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arcs:` + err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				res.status(200).json(data);


			}
				
		}

		//Add the arc to the users active queue list and the arc's queue meta	
		createarc.updateQueue(
			arcId,
			userName,
			sendResponse
		);

	console.log('The response is:' + res);

});

// We are getting sent a JSON from the client to storedata into MongoDB
app.post('/storedata', (req,res) => {

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arcs:` + err);

				res.status(400).json(err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				res.status(200).json(data);


			}
				
		}

		console.log('DEBUG: Recieved username is ' + req.body.userid);
		console.log('DEBUG: Recieved arcid is ' + req.body.arcid);
	 	console.log('DEBUG: Receieved JSON content is ' + JSON.stringify(req.body.content));
	 	console.log('DEBUG: Receieved Submit or Save flag is ' + req.body.selectedflag);


		// This is the callback function
		// This is a placeholder to report successful insertion of data	
	 	const reportStatus = (err, data) => {

	 		if (err) {

	 			console.log ('Insert failed for arcId: ' + req.body.arcid + '. System error: ' + err);
				res.status(400).json('Insert failed for arcId: ' + req.body.arcid + '. System error: ' + err);

	 		} else {

	 			console.log ('Insert successfully for arcId: ' + req.body.arcid + '.');
	 			res.status(200).json('Data successfully stored');
	 		}

	 	}

		//This is the calling function
		const storeData = (callback) => {

			// Create a data item with information recieved from the client
			const dataItem = {
				uname: req.body.userid,
				arcid: req.body.arcid,
				content: req.body.content
			}

			let promise = new Promise((resolve,reject) => {

				resolve(

					// https://mongodb.github.io/node-mongodb-native/1.4/driver-articles/mongoclient.html
					MongoClient.connect(
						mongoURL, 
						{
							native_parser: true,
					    	useNewUrlParser: true,
					    	connectTimeoutMS: 500
						    // db: {
						    //   native_parser: true,
						    //   useNewUrlParser: true
						    // },
						    // server: {
						    //   socketOptions: {
					  	 	//     connectTimeoutMS: 500
					    	//   }
					    	// },
					    	// replSet: {},
					    	// mongos: {}
					 	}, 
					 	function(err, client) {

					  		var db = client.db(process.env.MONGO_DB_NAME);

					  		if (err) {

					  			console.log('Connection to MongoDB failed. System error: ' + err);

					  		} else {

						  		//Since connection is successful, insert the data into the DB
								db.collection('projectarc').insertOne(dataItem, (err,result) => {

									if (err) {

										//Calling the callback function (reportStatus). The first parameter is error, second is something
										// you want to pass to the callback function
										callback(err, -1);
										client.close();

									} else {

										//Calling the callback function (reportStatus). The first parameter is error, second is something
										// you want to pass to the callback function
										callback(null, result);
										client.close();
									}

								});

							}

						  }
						)


					);

				reject ( new Error('Promise errored out'));
			
			});

			//promise.then((value) => { callback(null,value); console.log(value); })

	}

		//Use this to check the return code from MongoDB, the response will be available in the network
		// details in Chrome
		//storeData(sendResponse);

		// 
	 	storeData(reportStatus);
});

// We are getting sent a JSON from the client to storedata into MongoDB
app.get('/fetchcontent/:arcId', (req,res) => {


		//De-construct and assign variables from recieved parameters
		const { arcId } = req.params;

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error from the server when fetching arc content:` + err);
				res.status(500).json('DEBUG : Error from the server when fetching content: ' + err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				//res.status(200).json(data);
				res.status(200).json(data);


			}
				
		}
		

	 	let resultArray = [];
	 	let clientdb = null;

	 	MongoClient.connect(

	 		mongoURL,
	 		{
	 			native_parser: false,
				useNewUrlParser: true,
				connectTimeoutMS: 500
	 		},

	 		(err,client) => {

	 			if (err) {

	 				console.log('Connection to MongoDB failed. System error: ' + err);

	 			} else {

	 				var db = client.db(process.env.MONGO_DB_NAME);

	 				// Build a fetch query to fetch (exact match) the current arcId
	 				// The field within MongoDB is arcid
	 				let fetchQuery = { arcid : { $eq: arcId } }

	 				// Build a project to tell the fetch query the fields to return
	 				//let projection = { projection: {_id:0, uname:1,arcid:1,content:1}}

					//Fetch items from mongoDB that match the relevant arcId
					const fetchDataItems = db.collection('projectarc').find( fetchQuery );

					fetchDataItems.forEach((currentItem,err) => {

						//Push fetched items into an array
						resultArray.push(currentItem);
						console.log('Response from MongoDB: '+ resultArray[0].uname + ',' + resultArray[0].arcid + ',' + JSON.stringify(resultArray[0].content));

	 				})
	 				.then(() => {

	 					if (resultArray) {

	 						sendResponse(null,resultArray);
	 						client.close();

	 					} else {

	 						sendResponse('DEBUG: Error fetching user content from DB', null);
	 						client.close();
	 					}
	 		

	 				});

	 			}
	 			}

	 	);


});


// We are getting sent a JSON from the client to storedata into MongoDB
app.get('/incrementq/:arcId/:queueActiveSlot/:arcContributors/:queueSize', (req,res) => {


		//De-construct and assign variables from recieved parameters
		// KNOWN-ISSUE : arcContributors may not be required. To be removed after testing
		const { arcId , queueActiveSlot , arcContributors, queueSize } = req.params;

		//This is a generic callback function to responding to the client with data in JSON format
		// KNOWN-ISSUE : Bad coding practice. This function is currently declared in every function. It needs
		// to be taken to global
		const sendResponse = (err,data) => {

		console.log('Reply from the function is' + data);

			if (err) {

				console.log(`DEBUG : Error while incrementing arc queue:` + err);
				res.status(500).json('DEBUG : Queue increment failed: ' + err);

			} else {

				console.log(`DEBUG: Response from the server is:`+ data);

				//res.status(200).json(data);
				res.status(200).json(data);


			}
				
		}
	
		// Main function
		const incrementQ = (callback) => {

			// Check if the currently active slot is the last permissible
			// If the active slot is not the last permissible slot, increment the active slot by 1
			// Check if the active slot does not exceed the number of members in queue
			if (queueActiveSlot < queueSize) {

				db.hincrby(arcId+":meta","queueactiveslot", 1, (err,reply) => {

				if (err) {

					console.log('DEBUG: Queue position incremented failed - ' + err);

					callback('Queue increment failed', null);

				} else {

					console.log('DEBUG: Queue position incremented to - ' + reply);

					callback(null,'Increment successful');
			}

			});

		} else { //If the active slot is the last permissible slot, reset the active queue slot to 1 

			//Command for setting values for the starting template of arc meta data
			db.hset(

					//Unique arc id
					//This is the hash key
					//Contructed as : `arc:<id>:props` followed by the incremented value of key counter from hash last
					arcId+":meta",

					//The title of the arc,
					//String value.
					"queueactiveslot",
					1,

					(err, reply) => {

						// Redis commands in React. This one creates a hask key user:dileep and then proceeds to 
						// declare multiple key value pairs for it
						if (err) {

							console.log('DEBUG: Queue position incremented failed - ' + err);

							callback('Queue increment failed', null);
						} else {

							console.log('DEBUG: Queue position incremented to - ' + reply);

							callback(null,'Increment successful');

						}

				});



		}



	}

	incrementQ(sendResponse);

});

app.listen(process.env.SERVER_PORT, () => {

	console.log('DEBUG: Server is listening on port: ' + process.env.SERVER_PORT);


});
