var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
describe('POST', function () {

    it('events test case -- fetching user details', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });

    it('events test case -- check user details', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.body.should.have.property('username');
                done();
            });
    });

    it('events test case -- check other details', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.body.should.have.property('fname');
                done();
            });
    });
  /*  it('events test case -- fetching user details', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });*/



});