'use strict';

describe('Controller: ProductMessagesCtrl', function () {

  // load the controller's module
  beforeEach(module('ehApp'));

  var ProductMessagesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductMessagesCtrl = $controller('ProductMessagesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
