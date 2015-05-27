angular.module('starter.services', ['ngResource'])

.factory('Users', function($resource) {
  return $resource('https://rep-bfernandezsp.c9.io/api/users/:userId');
});
