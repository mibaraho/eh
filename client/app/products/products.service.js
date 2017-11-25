'use strict';

angular.module('ehApp')
  .factory('ProductsService', ['$resource', 'Auth', function($resource, Auth) {
    return $resource('/api/products/:id', null,
      {
        get: {
          url: '/api/products/:id',
          method:'GET',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        list: {
          url: '/api/m/:id/products',
          method:'GET',
          isArray: true,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        create: {
          url: '/api/m/:id/products',
          method:'POST',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        update: {
          url: '/api/products/:id',
          method:'PUT',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        approve: {
          url: '/api/products/:id/approve',
          method:'PUT',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        remove: {
          url: '/api/products/:id',
          method:'DELETE',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        }
      });
}]);
