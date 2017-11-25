'use strict';

angular.module('ehApp.auth', [
  'ehApp.constants',
  'ehApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
