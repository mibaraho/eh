'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var productMessageCtrlStub = {
  index: 'productMessageCtrl.index',
  show: 'productMessageCtrl.show',
  create: 'productMessageCtrl.create',
  update: 'productMessageCtrl.update',
  destroy: 'productMessageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productMessageIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './product-message.controller': productMessageCtrlStub
});

describe('ProductMessage API Router:', function() {

  it('should return an express router instance', function() {
    productMessageIndex.should.equal(routerStub);
  });

  describe('GET /api/product-messages', function() {

    it('should route to productMessage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productMessageCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/product-messages/:id', function() {

    it('should route to productMessage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productMessageCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/product-messages', function() {

    it('should route to productMessage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productMessageCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/product-messages/:id', function() {

    it('should route to productMessage.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'productMessageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/product-messages/:id', function() {

    it('should route to productMessage.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'productMessageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/product-messages/:id', function() {

    it('should route to productMessage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productMessageCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
