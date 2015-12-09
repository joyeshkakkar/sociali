var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
describe('POST', function () {

    it('logout test case', function (done) {
        chai.request(server)
            .post('/api/logout')
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });

});