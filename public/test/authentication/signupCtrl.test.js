var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
describe('POST', function () {

    it('signup test case -- creating user login', function (done) {
        chai.request(server)
            .post('/api/userLogin')
            .send({username: "test1", password: "test1"})
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });
    it('signup test case -- creating user details', function (done) {
        chai.request(server)
            .post('/api/userDetails')
            .send({username: "test1", fname: "ftest1",
                lname:"ltest",email:"test@test.com",phonenum :"6165656545"})
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });



});