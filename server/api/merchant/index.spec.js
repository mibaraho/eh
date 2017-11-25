'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var merchantCtrlStub = {
  index: 'merchantCtrl.index',
  show: 'merchantCtrl.show',
  create: 'merchantCtrl.create',
  update: 'merchantCtrl.update',
  destroy: 'merchantCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var merchantIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './merchant.controller': merchantCtrlStub
});

describe('Merchant API Router:', function() {

  it('should return an express router instance', function() {
    merchantIndex.should.equal(routerStub);
  });

  describe('GET /api/merchants', function() {

    it('should route to merchant.controller.index', function() {
      routerStub.get
        .withArgs('/', 'merchantCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/merchants/:id', function() {

    it('should route to merchant.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'merchantCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/merchants', function() {

    it('should route to merchant.controller.create', function() {
      routerStub.post
        .withArgs('/', 'merchantCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/merchants/:id', function() {

    it('should route to merchant.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'merchantCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/merchants/:id', function() {

    it('should route to merchant.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'merchantCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/merchants/:id', function() {

    it('should route to merchant.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'merchantCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
