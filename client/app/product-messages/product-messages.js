'use strict';

angular.module('ehApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('product-messages', {
        url: '/product-messages',
        templateUrl: 'app/product-messages/product-messages.html',
        controller: 'ProductMessagesCtrl'
      });
  });
