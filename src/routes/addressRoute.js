// Import required modules
const mongoose = require('mongoose');
const log4js = require('log4js');

// Instantiate model
var address = require('../models/address');

// Initialize log paramaters
const logger = log4js.getLogger();
logger.level = 'info';

// GET request to retrieve all address entries
function getAllAddress(req,res) {

   let query = address.find({});
   
   query.exec((err, addresses) => {

    if(err) res.send(err);

    res.json(addresses);
   });

}

//GET request to retrieve a book given its ID
function getAddressByID(req,res) {

    address.findOne({ "name": "req.params.name" }, (err,response) => {

        if(err) res.send(err);

        res.json(response);

    });
}

// POST template to recieve addresses as a template
function saveAddress(req, res) {

    var newAddress = new naddress(req.body);
 
    newAddress.save((err,response) => {
        if(err) {
            res.send(err);
        }
        else { 
            res.json({message: "Address added to DB", response });
        }
    });
}

module.exports = { getAllAddress, getAddressByID, saveAddress };