'use strict';

var app = require('../..');
import request from 'supertest';

var newProductImage;

describe('ProductImage API:', function() {

  describe('GET /api/product-images', function() {
    var productImages;

    beforeEach(function(done) {
      request(app)
        .get('/api/product-images')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productImages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productImages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/product-images', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/product-images')
        .send({
          name: 'New ProductImage',
          info: 'This is the brand new productImage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProductImage = res.body;
          done();
        });
    });

    it('should respond with the newly created productImage', function() {
      newProductImage.name.should.equal('New ProductImage');
      newProductImage.info.should.equal('This is the brand new productImage!!!');
    });

  });

  describe('GET /api/product-images/:id', function() {
    var productImage;

    beforeEach(function(done) {
      request(app)
        .get('/api/product-images/' + newProductImage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productImage = res.body;
          done();
        });
    });

    afterEach(function() {
      productImage = {};
    });

    it('should respond with the requested productImage', function() {
      productImage.name.should.equal('New ProductImage');
      productImage.info.should.equal('This is the brand new productImage!!!');
    });

  });

  describe('PUT /api/product-images/:id', function() {
    var updatedProductImage;

    beforeEach(function(done) {
      request(app)
        .put('/api/product-images/' + newProductImage._id)
        .send({
          name: 'Updated ProductImage',
          info: 'This is the updated productImage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProductImage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductImage = {};
    });

    it('should respond with the updated productImage', function() {
      updatedProductImage.name.should.equal('Updated ProductImage');
      updatedProductImage.info.should.equal('This is the updated productImage!!!');
    });

  });

  describe('DELETE /api/product-images/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/product-images/' + newProductImage._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productImage does not exist', function(done) {
      request(app)
        .delete('/api/product-images/' + newProductImage._id)
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
