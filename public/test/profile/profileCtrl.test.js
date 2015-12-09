var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
describe('POST', function () {

    it('preferences test case -- fetching user profile details', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });

    it('preferences test case -- check user details fetched', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.body.should.have.property('username');
                done();
            });
    });

    it('preferences test case -- check if record belongs to this user', function (done) {
        chai.request(server)
            .get('/api/findUserDetails/test')
            .end(function (res) {
                res.body.username.should.equal('test');
                done();
            });
    });

    it('preferences test case -- check if preferences are fetched', function (done) {
        chai.request(server)
            .get('/api/findUserPreferences/test')
            .end(function (res) {
                res.body.should.have.property('preferences');
                done();
            });
    });

    it('preferences test case -- check if radius is fetched', function (done) {
        chai.request(server)
            .get('/api/findUserPreferences/test')
            .end(function (res) {
                res.body.should.have.property('distance');
                done();
            });
    });

    it('preferences test case -- updating user details', function (done) {
        chai.request(server)
            .post('/api/updateUserDetails/test1').
            send({username: "test1", fname: "ftest1",
                lname:"ltest",email:"test@test.com",phonenum :"6165656545"})
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });

    it('preferences test case -- updating preferences', function (done) {
        chai.request(server)
            .post('/api/updateUserPreferences/test1').
            send({username: 'test1', preferences : '100', distance:'1'})
            .end(function (res) {
                res.should.have.status(200);
                done();
            });
    });


    it('preferences test case -- change password', function (done) {
        chai.request(server)
            .put('/api/userLogin/test1')
            .end(function (res) {
                res.should.have.status(200);
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