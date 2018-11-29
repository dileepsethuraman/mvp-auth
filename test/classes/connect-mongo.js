
// Import DB configurations
const { MONGO_URL } = require("../config");

// Import DB modules
const mongoose = require('mongoose');


// Set connectivity options
var conn_options = {

    native_parser: true,
    useNewUrlParser: true,
    connectTimeoutMS: 2000, //Milliseconds
    reconnectTries: 5,
    reconnectTries: 3000,   // Milliseconds
    auto_reconnect : true

}

// Export connection
module.exports = mongoose.createConnection(MONGO_URL, conn_options , (err) => {

    if (err) { return new Error('Connection to MongoDB failed');}

});



// Available connection options for MongoDB
// poolSize,ssl,sslValidate,sslCA,sslCert,sslKey,sslPass,
// sslCRL,autoReconnect,noDelay,keepAlive,keepAliveInitialDelay,
// connectTimeoutMS,family,socketTimeoutMS,
// reconnectTries,reconnectTries,ha,haInterval,
// replicaSet,secondaryAcceptableLatencyMS,
// acceptableLatencyMS,connectWithNoPrimary,authSource,
// w,wtimeout,j,forceServerObjectId,serializeFunctions,ignoreUndefined,
// raw,bufferMaxEntries,readPreference,pkFactory,promiseLibrary,readConcern,
// maxStalenessSeconds,loggerLevel,logger,promoteValues,promoteBuffers,promoteLongs,
// domainsEnabled,checkServerIdentity,validateOptions,appname,auth,user,password,authMechanism,
// compression,fsync,readPreferenceTags,numberOfRetries,auto_reconnect,minSize,monitorCommands,retryWrites,useNewUrlParser