'use strict';

var app = require('../..');
import request from 'supertest';

var newMerchant;

describe('Merchant API:', function() {

  describe('GET /api/merchants', function() {
    var merchants;

    beforeEach(function(done) {
      request(app)
        .get('/api/merchants')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          merchants = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      merchants.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/merchants', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/merchants')
        .send({
          name: 'New Merchant',
          info: 'This is the brand new merchant!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMerchant = res.body;
          done();
        });
    });

    it('should respond with the newly created merchant', function() {
      newMerchant.name.should.equal('New Merchant');
      newMerchant.info.should.equal('This is the brand new merchant!!!');
    });

  });

  describe('GET /api/merchants/:id', function() {
    var merchant;

    beforeEach(function(done) {
      request(app)
        .get('/api/merchants/' + newMerchant._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          merchant = res.body;
          done();
        });
    });

    afterEach(function() {
      merchant = {};
    });

    it('should respond with the requested merchant', function() {
      merchant.name.should.equal('New Merchant');
      merchant.info.should.equal('This is the brand new merchant!!!');
    });

  });

  describe('PUT /api/merchants/:id', function() {
    var updatedMerchant;

    beforeEach(function(done) {
      request(app)
        .put('/api/merchants/' + newMerchant._id)
        .send({
          name: 'Updated Merchant',
          info: 'This is the updated merchant!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMerchant = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMerchant = {};
    });

    it('should respond with the updated merchant', function() {
      updatedMerchant.name.should.equal('Updated Merchant');
      updatedMerchant.info.should.equal('This is the updated merchant!!!');
    });

  });

  describe('DELETE /api/merchants/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/merchants/' + newMerchant._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when merchant does not exist', function(done) {
      request(app)
        .delete('/api/merchants/' + newMerchant._id)
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
