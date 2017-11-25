'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var validationPolicyIntervalCtrlStub = {
  index: 'validationPolicyIntervalCtrl.index',
  show: 'validationPolicyIntervalCtrl.show',
  create: 'validationPolicyIntervalCtrl.create',
  update: 'validationPolicyIntervalCtrl.update',
  destroy: 'validationPolicyIntervalCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var validationPolicyIntervalIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './validation-policy-interval.controller': validationPolicyIntervalCtrlStub
});

describe('ValidationPolicyInterval API Router:', function() {

  it('should return an express router instance', function() {
    validationPolicyIntervalIndex.should.equal(routerStub);
  });

  describe('GET /api/validation-policy-intervals', function() {

    it('should route to validationPolicyInterval.controller.index', function() {
      routerStub.get
        .withArgs('/', 'validationPolicyIntervalCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/validation-policy-intervals/:id', function() {

    it('should route to validationPolicyInterval.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'validationPolicyIntervalCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/validation-policy-intervals', function() {

    it('should route to validationPolicyInterval.controller.create', function() {
      routerStub.post
        .withArgs('/', 'validationPolicyIntervalCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/validation-policy-intervals/:id', function() {

    it('should route to validationPolicyInterval.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'validationPolicyIntervalCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/validation-policy-intervals/:id', function() {

    it('should route to validationPolicyInterval.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'validationPolicyIntervalCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/validation-policy-intervals/:id', function() {

    it('should route to validationPolicyInterval.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'validationPolicyIntervalCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
