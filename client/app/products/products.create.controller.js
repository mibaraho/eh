'use strict';

angular.module('ehApp')
  .controller('MerchantProductsCreateCtrl', function ($scope, $state, ProductsService, Auth) {
    $scope.action = 'create';
    $scope.item = {}
    $scope.item.photos = []
    $scope.currentUser = {}
    $scope.disabled = true;

    Auth.getCurrentUser(function(currentUser){
      $scope.currentUser = currentUser;
      $scope.disabled = false;
    })


    $scope.submit = function(){
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $scope.disabled = true;
        ProductsService.create({ id: $scope.currentUser.MerchantId }, $scope.item, function(result){
          $state.go('merchant-products')
        }, function(err){
          console.log(err)
        })
      }
    }

  });
