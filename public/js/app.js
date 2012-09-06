
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









// ISSUES

function IssuesController($scope, Issues, Auth) {

  $scope.issues = Issues.query()
  $scope.auth = Auth

  $scope.create = function(firstOption, secondOption) {
    issue = {first: {name: $scope.firstOption}, second: {name: $scope.secondOption}}
    Issues.save(issue)
    $scope.issues = Issues.query()
  }
};



// ISSUE DETAILS

function IssueDetailsController($scope, Issues, $routeParams, Auth) {
  $scope.issueId = $routeParams._id
  $scope.issue = Issues.get({_id: $routeParams._id})
  $scope.auth = Auth

  $scope.vote = function(option) {
    option.votes++
    Issues.vote($scope.issue, option, function() {
      console.log("VOTED")
    })
  }

  $scope.remove = function() {
    Issues.remove({_id: $routeParams._id})
    window.location = "/"
  }
}



function LoginController($scope, Auth) {
  $scope.auth = Auth

  $scope.login = function() {
    Auth.login($scope.newUsername)
  }

  $scope.logout = function() {
    Auth.logout()
  }
}



/// FILTERS ///
app.filter('ago', function() {
  return function(text) {
    return moment(text).fromNow()
  }
})







//// SERVICES ////
app.factory('Issues', function($http, $resource, Auth) {
  Issues = $resource("/issues/:_id")

  Issues.vote = function(issue, vote, cb) {
    vote.username = Auth.username
    $http.post("/issues/" + issue._id + "/votes", vote).success(cb)
  }

  return Issues
})

app.factory('Auth', function() {
  Auth = {
    username: localStorage.username,
    login: function(username) {
      localStorage.username = username
      this.username = username
      this.loggedIn = true
    },
    logout: function() {
      localStorage.removeItem('username')
      delete this.username
      this.loggedIn = false
    }
  }
  Auth.loggedIn = !!Auth.username
  return Auth
})




//// DIRECTIVES ////
app.directive('coloredBar', function() {
  return {
    link: function(scope, element, attrs) {
      var INCREMENTAL_WIDTH = 20
      var MIN_WIDTH = 30

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


app.directive('pieChart', function() {
  return {
    link: function(scope, element, attrs) {
      var firstTotal = null
      var secondTotal = null

      var original = element.clone()

      scope.$watch(attrs.first, function(first) {
        firstTotal = first
        render()
      })

      scope.$watch(attrs.second, function(second) {
        secondTotal = second
        render()
      })

      function render() {
        if (!(firstTotal > -1 && secondTotal > -1)) return

        var total = firstTotal + secondTotal
        var percent = 50

        if (total > 0)
          percent = Math.floor(firstTotal * 100 / total)

        element.data('percent', percent)

        if (element.data('easyPieChart')) {
          element.data('easyPieChart').update(percent)
        }

        else {
          element.html("<span class='text'></span>")
          element.easyPieChart({
            barColor: "#3A3",
            trackColor: "#CCC",
            scaleColor: false,
            lineWidth: 30,
            lineCap: "butt",
            size: 150,
            animate: 500
          })
        }

        element.find('.text').text(firstTotal + " / " + total)
      }
    }
  }
})
