'use strict';

var app = require('../..');
import request from 'supertest';

var newProductMessage;

describe('ProductMessage API:', function() {

  describe('GET /api/product-messages', function() {
    var productMessages;

    beforeEach(function(done) {
      request(app)
        .get('/api/product-messages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productMessages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productMessages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/product-messages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/product-messages')
        .send({
          name: 'New ProductMessage',
          info: 'This is the brand new productMessage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProductMessage = res.body;
          done();
        });
    });

    it('should respond with the newly created productMessage', function() {
      newProductMessage.name.should.equal('New ProductMessage');
      newProductMessage.info.should.equal('This is the brand new productMessage!!!');
    });

  });

  describe('GET /api/product-messages/:id', function() {
    var productMessage;

    beforeEach(function(done) {
      request(app)
        .get('/api/product-messages/' + newProductMessage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      productMessage = {};
    });

    it('should respond with the requested productMessage', function() {
      productMessage.name.should.equal('New ProductMessage');
      productMessage.info.should.equal('This is the brand new productMessage!!!');
    });

  });

  describe('PUT /api/product-messages/:id', function() {
    var updatedProductMessage;

    beforeEach(function(done) {
      request(app)
        .put('/api/product-messages/' + newProductMessage._id)
        .send({
          name: 'Updated ProductMessage',
          info: 'This is the updated productMessage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProductMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductMessage = {};
    });

    it('should respond with the updated productMessage', function() {
      updatedProductMessage.name.should.equal('Updated ProductMessage');
      updatedProductMessage.info.should.equal('This is the updated productMessage!!!');
    });

  });

  describe('DELETE /api/product-messages/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/product-messages/' + newProductMessage._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productMessage does not exist', function(done) {
      request(app)
        .delete('/api/product-messages/' + newProductMessage._id)
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
