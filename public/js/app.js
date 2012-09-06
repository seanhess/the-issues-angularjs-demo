
// NOTE: you can totally split this up into multiple files and angular modules
// and use a module loader. But for simplicity we'll put everything in one file




// ROUTER / MAIN MODULE

var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl   : 'partials/issues.html',
    controller : IssuesController  
  })

  $routeProvider.otherwise({ 
    redirectTo : '/'
  })

})

// use push state/html5 urls
app.config(function($locationProvider) {  
  $locationProvider.hashPrefix('')
  $locationProvider.html5Mode(true)
})


// ISSUES SERVICE
app.factory('Issues', function($http, $resource) {
  return $resource("/issues/:id")
})



// ISSUES

function IssuesController($scope, Issues) {
  $scope.pageTitle = 'hello world!'

  $scope.issues = Issues.query()

  $scope.create = function(firstOption, secondOption) {
    issue = {firstOption: $scope.firstOption, secondOption: $scope.secondOption}
    Issues.save(issue)
    $scope.issues = Issues.query()
  }
};







//// DIRECTIVES ////
app.directive('coloredBar', function() {
  return {
    link: function(scope, element, attrs) {
      var INCREMENTAL_WIDTH = 10
      var MIN_WIDTH = 50

      // have a min width?

      scope.$watch(attrs.total, function(total) {
        width = Math.max(total * INCREMENTAL_WIDTH, MIN_WIDTH)
        element.css('width', width + 'px')
      })

      scope.$watch(attrs.text, function(text) {
        element.text(text)
      })
    }
  }
})
