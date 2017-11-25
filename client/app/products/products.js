'use strict';

angular.module('ehApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('merchant-products', {
        url: '/merchant/products',
        templateUrl: 'app/products/products.html',
        controller: 'MerchantProductsCtrl'
      })
      .state('merchant-products-create', {
        url: '/merchant/products/create',
        templateUrl: 'app/products/products.cu.html',
        controller: 'MerchantProductsCreateCtrl'
      })
      .state('merchant-products-edit', {
        url: '/merchant/products/:id/edit',
        templateUrl: 'app/products/products.cu.html',
        controller: 'MerchantProductsEditCtrl'
      });
  });
