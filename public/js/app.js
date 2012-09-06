
// NOTE: you can totally split this up into multiple files and angular modules
// and use a module loader. But for simplicity we'll put everything in one file




// ROUTER / MAIN MODULE

var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl  : 'partials/issues.html',
    controller : IssuesController  
  })

  $routeProvider.when('/details/:_id', {
    templateUrl  : 'partials/issue.html',
    controller : IssueDetailsController  
  })

  $routeProvider.otherwise({ 
    redirectTo : '/'
  })

})




// ISSUES SERVICE
app.factory('Issues', function($http, $resource) {
  return $resource("/issues/:_id")
})









// ISSUES

function IssuesController($scope, Issues) {
  console.log("MAIN")
  $scope.pageTitle = 'hello world!'

  $scope.issues = Issues.query()

  $scope.create = function(firstOption, secondOption) {
    issue = {firstOption: $scope.firstOption, secondOption: $scope.secondOption}
    Issues.save(issue)
    $scope.issues = Issues.query()
  }
};



// ISSUE DETAILS

function IssueDetailsController($scope, Issues, $routeParams) {
  console.log("ISSUE DETAILS BABY!", $routeParams._id)
  $scope.issueId = $routeParams._id
  $scope.issue = Issues.get({_id: $routeParams._id}, function(d, asdf, booo) {
    console.log("HI", $scope.issue)
  })
}










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
