'use strict';

angular.module('ehApp')
  .controller('MerchantProductsCtrl', function ($scope, ProductsService, Auth, socket) {

    $scope.pendingActions = true;
    $scope.err = false;
    var getItems = function(page) {
      $scope.pendingActions = true;
      ProductsService.list({ id : $scope.currentUser.MerchantId }).$promise.then(function(result){
        $scope.products = result;
        socket.syncUpdates('product', $scope.products);
      }, function(err){

        $scope.error = true;
        $scope.pendingActions = false;

      });
    }

    Auth.getCurrentUser(function(currentUser){
      $scope.currentUser = currentUser;
      getItems()
    })
  });
