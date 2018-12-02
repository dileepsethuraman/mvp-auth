// Build default Mongo Connection string
var MONGO_URL = 'mongodb://localhost:27017';

//Include mongoDB package for content storage
var MongoClient = require('mongodb').MongoClient;

//Function to create a test entry in Redis
createTestEntry = () => {

				
	MongoClient.connect(
		MONGO_URL, 
			{
				native_parser: true,
				useNewUrlParser: true,
				connectTimeoutMS: 500
			}, 
			function(err, client) {

				var db = client.db('newdb');

				if (err) 
				{

					console.log('Connection to MongoDB failed. System error: ' + err);

				} else {

					//Since connection is successful, insert the data into the DB
					db.collection('addresses').deleteMany({}, (err,result) => {

						if (err) {

							//Calling the callback function (reportStatus). The first parameter is error, second is something
							// you want to pass to the callback function
							console.log('MongoDB flush failed. System error: ' + err);

						} else {

							//Calling the callback function (reportStatus). The first parameter is error, second is something
							// you want to pass to the callback function
							console.log('MongoDB flush successful. System message: ' + err);
						}

					});

					dataItem = [
						{
							"name": "john",
							"street": "30 Somewhere Street",
							"postcode": 3000

						},
						{
							"name": "mary",
							"street": "33 Fastfoot Street",
							"postcode": 3001

						}
					]

					//Since connection is successful, insert the data into the DB
					db.collection('addresses').insertMany(dataItem, (err,result) => {

					if (err) {
							console.log('Insert failed');
					}
			
					});
			

				}

				client.close();
	});

}

createTestEntry();
