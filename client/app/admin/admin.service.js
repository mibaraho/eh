'use strict';

angular.module('ehApp')
  .factory('ValidationPolicyIntervalsService', ['$resource', 'Auth', function($resource, Auth) {
    return $resource('/api/intervals/:id', null,
      {
        list: {
          url: '/api/validation-policy-intervals',
          method:'GET',
          isArray: true,
          headers: {
            Authorization: Auth.getToken()
          }
        },
        update: {
          url: '/api/validation-policy-intervals/:id',
          method:'PUT',
          isArray: false,
          headers: {
            Authorization: Auth.getToken()
          }
        },
      });
}]);
