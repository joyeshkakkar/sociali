var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
describe('POST', function () {

    it('login test case', function (done) {
        chai.request(server)
            .post('/api/login')
            .send({username: "test", password: "test"})
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });

    it('invalid login test case', function (done) {
        chai.request(server)
            .post('/api/login')
            .send({username: "tessdt", password: "test"})
            .end(function (res) {
                res.should.have.status(401);
                done();
            });
    });
});