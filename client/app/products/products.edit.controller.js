'use strict';

angular.module('ehApp')
  .controller('MerchantProductsEditCtrl', function ($scope, $state, $stateParams, ProductsService, Auth) {
   $scope.action = 'edit';
    $scope.item = {}
    $scope.currentUser = {}
    $scope.disabled = true;
    $scope.pendingActions = true;

    Auth.getCurrentUser(function(currentUser){
      $scope.currentUser = currentUser;
      $scope.disabled = false;
    })

    ProductsService.get({ id: $stateParams.id }).$promise.then(function(result){
      $scope.item = result;
      $scope.pendingActions = false;
    }, function(err){
      console.log(err)
    })

    $scope.submit = function(){
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $scope.disabled = true;
        ProductsService.update({ id: $scope.item._id }, $scope.item, function(result){
          $state.go('merchant-products')
        }, function(err){
          console.log(err)
        })
      }
    }
    $scope.approve = function(){
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $scope.disabled = true;
        var _update = {
          validationStatus: 'accepted'
        }
        ProductsService.approve({ id: $scope.item._id }, _update, function(result){
          $state.go('merchant-products')
        }, function(err){
          console.log(err)
        })
      }
    }
    $scope.reject = function(){
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $scope.disabled = true;
        var _update = {
          validationStatus: 'rejected'
        }
        ProductsService.update({ id: $scope.item._id }, _update, function(result){
          $state.go('merchant-products')
        }, function(err){
          console.log(err)
        })
      }
    }
  });
