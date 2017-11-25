'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var productImageCtrlStub = {
  index: 'productImageCtrl.index',
  show: 'productImageCtrl.show',
  create: 'productImageCtrl.create',
  update: 'productImageCtrl.update',
  destroy: 'productImageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productImageIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './product-image.controller': productImageCtrlStub
});

describe('ProductImage API Router:', function() {

  it('should return an express router instance', function() {
    productImageIndex.should.equal(routerStub);
  });

  describe('GET /api/product-images', function() {

    it('should route to productImage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productImageCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/product-images/:id', function() {

    it('should route to productImage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productImageCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/product-images', function() {

    it('should route to productImage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productImageCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/product-images/:id', function() {

    it('should route to productImage.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'productImageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/product-images/:id', function() {

    it('should route to productImage.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'productImageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/product-images/:id', function() {

    it('should route to productImage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productImageCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
