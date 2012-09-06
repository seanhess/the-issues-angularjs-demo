
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




//// SERVICES ////
app.factory('Issues', function($http, $resource) {
  return $resource("/issues/:_id")
})

app.factory('Login', function() {
  return {
    username: function() {
      return localStorage.username
    },
    login: function(username) {
      localStorage.username = username
    },
    logout: function() {
      localStorage.removeItem('username')
    }
  }
})









// ISSUES

function IssuesController($scope, Issues, Login) {
  
  $scope.issues = Issues.query()
  $scope.username = Login.username()

  $scope.create = function(firstOption, secondOption) {
    issue = {firstOption: $scope.firstOption, secondOption: $scope.secondOption}
    Issues.save(issue)
    $scope.issues = Issues.query()
  }

  $scope.login = function() {
    Login.login($scope.newUsername)
    $scope.username = Login.username()
  }

  $scope.logout = function() {
    Login.logout()
    $scope.username = Login.username()
  }
};



// ISSUE DETAILS

function IssueDetailsController($scope, Issues, $routeParams) {
  $scope.issueId = $routeParams._id
  $scope.issue = Issues.get({_id: $routeParams._id})
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
