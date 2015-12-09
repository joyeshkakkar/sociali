var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();
var mongoose=require('mongoose');
var expect = require('expect.js');
chai.use(chaiHttp);
var login = require('../public/test/authentication/loginCtrl.test');
var logout = require('../public/test/authentication/logoutCtrl.test');
var signup = require('../public/test/authentication/signupCtrl.test');
var event = require('../public/test/events/eventsCtrl.test');
var myEvent = require('../public/test/myEvents/myEventsCtrl.test');
var profile = require('../public/test/profile/profileCtrl.test');
var contact = require('../public/test/contact/contactCtrl.test');

