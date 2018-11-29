// Include assertion libraries
const assert = require('chai').assert;
const chaiShould = require('chai').should;
const chaiHttp = require('chai-http');
const server = require('../server'); // Pull the express server details from app

// Include file to be tested
const serverjs = require('../server');
const {REDIS_HOST, REDIS_PORT, MONGO_URL} = require('../src/config');


//Initialize middleware
chaiShould.use(chaiHttp);

// Assertion check to ensure environment variables are set
describe('Check for environment variables', function () {

    it('REDIS_HOST must be a string', function() {

        assert.typeOf(REDIS_HOST, 'string', 'String validation passed');

    });

     
    it('REDIS_PORT must be a string', function() {

        assert.typeOf(REDIS_PORT, 'string', 'String validation passed');

    });

    it('MONGO_URL must be a string', function() {

        assert.typeOf(MONGO_URL, 'string', 'String validation passed');

    });

 
});

describe('Test /GET request', function() {

    it ('All addresses are retrieved on GET request to /address', function() {

        chaiShould.request(server)
            .get('/address')
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            });
    });
});
