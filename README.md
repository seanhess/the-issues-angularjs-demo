The Issues: An AngularJS Demo Application
=========================================

This vs That demo application written in AngularJS. This was prepared for a UtahJS presentation. This Readme is equivalent to slide deck.

Demo: http://the-issues.herokuapp.com/

Discuss: http://news.ycombinator.com/item?id=4488847

About Me
--------

* CTO and Cofounder of i.TV
* http://seanhess.github.com

Why Angular
-----------

* opinionated: fewer decisions
* fast and easy: avoid crap
* maintainable: reusable view and data logic, easy to refactor, modular, clean resulting code
* testable: easy to test the *right* things
* good abstractions: think high level most of the time, but easy to customize

Trade-offs
----------

* opinionated: if you have really strong feelings about how it should be done
* deeper: the framework does more, so you will spend more time in the docs

The Angular Model
-----------------

* Controllers: store/manipulate data and state
* Views: HTML and widgets bound to controllers
* Services: abstract data logic
* Directives: abstract view logic/widgets
* Filters: compose data binding
* Injection: give you what you need

Data Binding
------------

Simple controller

    function WelcomeController ($scope) {
        $scope.user = {name: "Sean"}
        $scope.updateUserName = function() {
            $scope.user.name = $scope.newUserName
        }
    }

And the view to go with it

    <h1>Hello: {{user.name}}</h1>
    <input ng-model="newUserName">
    <button ng-click="updateUserName()">Update</button>

* All you have to do is manipulate the object in the scope
* Two-way binding with ng-model
* Updates only what has changed, only when it is changed


Services
--------

Abstract any data or API

    module.factory('Twitter', function() {
        return {
            getTweets: function(cb) {
                // get tweets
            }
        }      
    })

    function TweetsController($scope, Twitter) {
        Twitter.getTweets = function(tweets) {
            $scope.tweets = tweets
        }
    }

Services - Resource
-------------------

Easily use Resourceful REST APIs

    module.factory('BlogPosts', function($resource) {
        return $resource("/posts/:id")
    })

    function PostsController($scope, BlogPosts) {
        $scope.posts = BlogPosts.query()
    }


Built In Directives
-------------------

Make your life easier. These aren't specific to a view, but are what different views have in common, like repeating

    <div class="tweets">
        <div class="tweet" ng-repeat="tweet in tweets">
            <div class="user">{{tweet.username}}</div>
            <div class="text">{{tweet.body}}</div>
        </div>
    </div>

Custom Directives
-----------------

You can make your own reusable HTML. Here we want to make a reusable modal lightbox component

    <div class="picture">
      <div lightbox="picture.url"></div>
    </div>

    module.directive('lightbox', function() {
        return function(scope, element, attrs) {
            // element is a jquery element. Make it a lightbox!
            // when clicked, launch the lightbox
        }      
    })

See the code for a full example. (pie-chart, colored-bar)


Filters
-------

Filters let you compose data binding. Assume your dates are in ISO format. We can create an `ago` filter to render the date as "X minutes ago"


    module.filter('ago', function() {
      return function(text) {
        return moment(text).fromNow()
      }
    })

    <div class="date">{{post.created | ago}}</div>


The Issues: Rendering the List
------------------------------

We need to boostrap. (see index.html, app.js)

We need to define a simple resource oriented service

    app.factory('Issues', function($resource) {
      Issues = $resource("/issues/:_id")
      return Issues
    })

Here's our basic controller

    function IssuesController($scope, Issues) {
      $scope.issues = Issues.query()
    }

Now we can bind to the array

    <div class="issue" ng-repeat="issue in issues">
      {{issue.first.name}} VS {{issue.second.name}}
    </div> 



The Issues: Adding an Issue
---------------------------

We add a .create method on our scope

    function IssuesController($scope, Issues) {
      // ...
      $scope.create = function() {
        issue = {first: {name: $scope.firstOption}, second: {name: $scope.secondOption}}
        Issues.save(issue, function() {
          $scope.issues = Issues.query()
        })
      }
    }

We can call it in our event handler

    <div class="new_issue">
      <h3>Add an Issue</h3>
      <div><input placeholder="something" ng-model="firstOption"></div>
      <div>VS</div>
      <div><input placeholder="else" ng-model="secondOption"></div>
      <div><button ng-click="create()">Create</div>
    </div>


The Issues: Custom Directive: Colored Bar
-----------------------------------------

We want to display a bar representing the number of votes. It's a custom widget used like this

    <div class="first bar" colored-bar total="issue.first.votes" text="issue.first.name"></div>
    <span>VS</span> 
    <div class="second bar" colored-bar total="issue.second.votes" text="issue.second.name"></div>

Here's how you define it. We use $watch so we can respond to binding changes. `element` is a jQuery element

    module.directive('coloredBar', function() {
      return {
        link: function(scope, element, attrs) {
          var INCREMENTAL_WIDTH = 20
          var MIN_WIDTH = 30

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



The Issues: Custom Service: Auth
--------------------------------

We will abstract the authentication mechanism away. All we know is that the module has some methods and some properties to bind to (like username and loggedIn). 

Inject the Auth service into our controller, and put it on the scope

    function IssuesController($scope, Issues, Auth) {
      // ...
      $scope.auth = Auth
      $scope.login = function() {
        Auth.login($scope.newUsername)
      }
    })


Allow the user to log in

    <div><input placeholder="username" ng-model="newUsername"></div>
    <div><button ng-click="login()">Login</button></div>

Only show the new issue box if we are logged in. This will automatically show it if they login.

    <div class="new_issue" ng-show="auth.loggedIn">

The definition of the Auth service
    
    module.factory('Auth', function() {
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


The Issues: Details page
------------------------

Add another route, a partial, and its controller. (Same as before)

    $routeProvider.when('/details/:_id', {
      templateUrl  : 'partials/issue.html',
      controller : IssueDetailsController  
    })


Issue Details: Turning a jQuery plugin into a directive
-------------------------------------------------------

You have to include jquery before angular so it uses it instead of "jquery lite"

We want to use a pie chart component! Let's make a directive

    <div pie-chart percent="issue.first.percent"></div>

In the directive code, we initialize the chart.

    module.directive('pieChart', function() {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(attrs.percent, function(percent) {
            element.data('percent', percent)
            element.easyPieChart({
              barColor: "#3A3",
              trackColor: "#CCC",
              scaleColor: false,
              lineWidth: 30,
              lineCap: "butt",
              size: 150,
              animate: 500
            })
          })
        })
      }
    })

Issue Details: Extend our Issues Service to Vote
------------------------------------------------

Adding a vote doesn't fit our resource model perfectly, so let's add a method. Notice that this depends on Auth!

    module.factory('Issues', function($http, $resource, Auth) {
      Issues = $resource("/issues/:_id")

      Issues.vote = function(issue, vote, cb) {
        vote.username = Auth.username
        $http.post("/issues/" + issue._id + "/votes", vote).success(cb)
      }

      return Issues
    }

Now we can vote from our controller

    $scope.vote = function(option) {
      Issues.vote($scope.issue, option)
    }

    <div class="castVote">
      <button ng-click="vote(issue.first)">Vote {{issue.first.name}}</button>
      <button ng-click="vote(issue.second)">Vote {{issue.second.name}}</button>
    </div>


Issue Details: Using filters
----------------------------

Let's pipe the created date through our custom `ago` filter

    module.filter('ago', function() {
      return function(text) {
        return moment(text).fromNow()
      }
    })

    <td>{{vote.created | ago}}</td>

Filters can take parameters. Let's use the built-in `orderBy` filter to order the votes on the details page.

    <tr class="vote" ng-repeat="vote in issue.votes | orderBy:'-created'">



Issue Details: Realtime Differential Updates
--------------------------------------------

We want a realtime app. When someone votes, let's update the voting results without re-rending everything.

Instead of calling `Issues.get({_id: id})`, we will write a method that polls, and updates the original object.

    // in Issues service
    Issues.pollIssue = function(matching, interval) {
      var issue = Issues.get(matching)

      function fetch() {
        newIssue = Issues.get(matching, function() {

          // we are updating the object we returned from the first function
          _.extend(issue, newIssue)
        })
      }

      interval = setInterval(fetch, interval)

      return issue
    }

So if our controller binds to the result of this, updates will always be applied differentially

    // IssueDetailsController
    $scope.issue = Issues.pollIssue({_id: id}, 1000)

And only the bindings that have changed will be replaced

    <div>First Votes: {{issue.first.votes}}</div>
    <div>Second Votes: {{issue.second.votes}}</div>




Concerns
--------

* too much logic in the views (ng-pluralize)?
* out of control: how do you "drop down" and optimize when you need to
* differential updates?
* general performance? How does it work? When will that need to be optimized?
* Others?


Other Resources
---------------
* [AngularJS](http://angularjs.org/)
* [Projects Built With AngularJS](http://builtwith.angularjs.org/)
* [AngularJS Tutorial](http://docs.angularjs.org/tutorial/)
* [Google Group](https://groups.google.com/forum/?fromgroups#!forum/angular)


Discuss
-------

http://news.ycombinator.com/item?id=4488847
