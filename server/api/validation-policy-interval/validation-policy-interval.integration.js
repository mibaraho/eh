'use strict';

var app = require('../..');
import request from 'supertest';

var newValidationPolicyInterval;

describe('ValidationPolicyInterval API:', function() {

  describe('GET /api/validation-policy-intervals', function() {
    var validationPolicyIntervals;

    beforeEach(function(done) {
      request(app)
        .get('/api/validation-policy-intervals')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          validationPolicyIntervals = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      validationPolicyIntervals.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/validation-policy-intervals', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/validation-policy-intervals')
        .send({
          name: 'New ValidationPolicyInterval',
          info: 'This is the brand new validationPolicyInterval!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newValidationPolicyInterval = res.body;
          done();
        });
    });

    it('should respond with the newly created validationPolicyInterval', function() {
      newValidationPolicyInterval.name.should.equal('New ValidationPolicyInterval');
      newValidationPolicyInterval.info.should.equal('This is the brand new validationPolicyInterval!!!');
    });

  });

  describe('GET /api/validation-policy-intervals/:id', function() {
    var validationPolicyInterval;

    beforeEach(function(done) {
      request(app)
        .get('/api/validation-policy-intervals/' + newValidationPolicyInterval._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          validationPolicyInterval = res.body;
          done();
        });
    });

    afterEach(function() {
      validationPolicyInterval = {};
    });

    it('should respond with the requested validationPolicyInterval', function() {
      validationPolicyInterval.name.should.equal('New ValidationPolicyInterval');
      validationPolicyInterval.info.should.equal('This is the brand new validationPolicyInterval!!!');
    });

  });

  describe('PUT /api/validation-policy-intervals/:id', function() {
    var updatedValidationPolicyInterval;

    beforeEach(function(done) {
      request(app)
        .put('/api/validation-policy-intervals/' + newValidationPolicyInterval._id)
        .send({
          name: 'Updated ValidationPolicyInterval',
          info: 'This is the updated validationPolicyInterval!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedValidationPolicyInterval = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedValidationPolicyInterval = {};
    });

    it('should respond with the updated validationPolicyInterval', function() {
      updatedValidationPolicyInterval.name.should.equal('Updated ValidationPolicyInterval');
      updatedValidationPolicyInterval.info.should.equal('This is the updated validationPolicyInterval!!!');
    });

  });

  describe('DELETE /api/validation-policy-intervals/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/validation-policy-intervals/' + newValidationPolicyInterval._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when validationPolicyInterval does not exist', function(done) {
      request(app)
        .delete('/api/validation-policy-intervals/' + newValidationPolicyInterval._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
