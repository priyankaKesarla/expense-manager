'use strict';

/* App Module */

var budgetApp = angular.module('budgetApp', [
  'ngRoute',
  'budgetControllers',
]);

budgetApp.factory('UserService', ['$rootScope', function($rootScope) {
    var user = {
      isLogged: false,
      user: {}
    };

    $rootScope.user = user;

    return user;
}]);

budgetApp.directive('checkUser', ['$rootScope', '$location', 'UserService', function ($root, $location, userSrv) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs, ctrl) {
      $root.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
        if (nextRoute.access.requiredLogin && !userSrv.isLogged) {
          $location.path("/login");
        }
      });
    }
  }
}]);

var budgetControllers = angular.module('budgetControllers', []);

budgetApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/records', {
        templateUrl: 'partials/account-detail.html',
        controller: 'AccountDetailCtrl',
        access: { requiredLogin: true }
      }).
      when('/categories', {
        templateUrl: 'partials/category.html',
        controller: 'CategoryCtrl',
        access: { requiredLogin: true }
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'UserLoginCtrl',
        access: { requiredLogin: false }
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'UserRegisterCtrl',
        access: { requiredLogin: false }
      }).
      when('/logout', {
        templateUrl: 'partials/login.html',
        controller: 'UserLogoutCtrl',
        access: { requiredLogin: true }
      }).
      otherwise({
        redirectTo: '/records',
        access: { requiredLogin: true }
      });
  }]);

