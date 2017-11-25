'use strict';

angular.module('ehApp')
  .factory('ProductMessagesService', ['$resource', 'Auth', function($resource, Auth) {
    return $resource('/api/product-messagess/:id', null,
      {
        get: {
          url: '/api/product-messages/:id',
          method:'GET',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        list: {
          url: '/api/products/:id/messages',
          method:'GET',
          isArray: true,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        create: {
          url: '/api/products/:id/messages',
          method:'POST',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        update: {
          url: '/api/product-messages/:id',
          method:'PUT',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        }
      });
}]);
