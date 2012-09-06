the-issues
==========

This vs That demo application written in AngularJS. This was prepared for a UtahJS presentation. This Readme is equivalent to slide deck

About Me
--------

* CTO and Cofounder of i.TV
* Years of consulting
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


This Application
----------------


Concerns
--------

* too much logic in the views (ng-pluralize)?
* out of control: how do you "drop down" and optimize when you need to
* differential updates?
* general performance? How does it work? When will that need to be optimized?
* Others?



