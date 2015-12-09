var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
describe('POST', function () {

    it('my events test case -- fetching user events details', function (done) {
        chai.request(server)
            .get('/api/findUserEvents/test')
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });

    it('my events test case -- check user details fetched', function (done) {
        chai.request(server)
            .get('/api/findUserEvents/test')
            .end(function (res) {
                res.body.should.have.property('username');
                done();
            });
    });

    it('my events test case -- check if record belongs to this user', function (done) {
        chai.request(server)
            .get('/api/findUserEvents/test')
            .end(function (res) {
                res.body.username.should.equal('test');
                done();
            });
    });

    it('my events test case -- check if events are fetched', function (done) {
        chai.request(server)
            .get('/api/findUserEvents/test')
            .end(function (res) {
                res.body.events.should.be.a('array');
                done();
            });
    });

    it('my events test case -- check events fetched details', function (done) {
        chai.request(server)
            .get('/api/findUserEvents/test')
            .end(function (res) {
                res.body.should.have.property('events');
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