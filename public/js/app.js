
// NOTE: you can totally split this up into multiple files and angular modules
// and use a module loader. But for simplicity we'll put everything in one file




// ROUTER / MAIN MODULE

var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl  : 'partials/issues.html',
    controller : IssuesController  
  })

  $routeProvider.otherwise({ 
    redirectTo : '/'
  })
})









function IssuesController($scope, Issues) {
  $scope.issues = Issues.query()
};



//// SERVICES ////
app.factory('Issues', function($resource) {
  Issues = $resource("/issues/:_id")
  return Issues
})


