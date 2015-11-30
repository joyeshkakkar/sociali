var app = angular.module("SocialiApp", ['ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngPasswordStrength']);

app.config(['uiGmapGoogleMapApiProvider', function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDyA2ZxKMduBRg3b3s4-ZgLgvHBzjWYtGk',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
}]
);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
     when('/home', {
         templateUrl: 'views/home/homepage.html'
        , controller: 'HomeController'
     }).
    when('/events', {
        templateUrl: 'views/events/events.html'
        , controller: 'EventsController'
    }).
    when('/myEvents', {
        templateUrl: 'views/myEvents/myEvents.html'
        , controller: 'MyEventsController'
        , resolve: {
            loggedin: checkUserLoggedin
        }
    }).
    when('/profile', {
        templateUrl: 'views/profile/profile.html'
        , controller: 'ProfileController'
        , resolve: {
            loggedin: checkUserLoggedin
        }
    }).
     when('/contact', {
         templateUrl: 'views/contact/contact.html'
         , controller: 'ContactController'
     }).
    when('/logout', {
        templateUrl: 'views/home/homepage.html'
        , controller: 'LogoutController'
    }).
    otherwise({
        redirectTo: '/home'

    });
    /*   when('/about', {
           templateUrl: 'upbeat/about.html'
       }).
      when('/signup', {
          templateUrl: 'views/signup/signUp.html'
          , controller: 'SignupController'
      }).
      when('/playlist', {
          templateUrl: 'views/playlist/playlist.html'
          , controller: 'PlaylistController'
          , resolve: {
              loggedin: checkUserLoggedin
          }
      }).
      when('/logout', {
          //templateUrl: 'views/home/home.html'
          templateUrl: 'views/search/search.html'
          , controller: 'LogoutController'
      }).
      when('/contact', {
          templateUrl: 'views/contact/contact.html'
          , controller: 'ContactController'
      }).
      when('/profile', {
          templateUrl: 'views/profile/profile.html'
          , controller: 'ProfileController'
          , resolve: {
              loggedin: checkUserLoggedin
          }
      }).*/

}]);


var checkUserLoggedin = function ($q, $timeout, $http, $location, $rootScope, UserService) {
    var deferred = $q.defer();
    $http.get('/api/loggedin')
        .success(function (user) {
            $rootScope.errorMessage = null;
            //user is Authenticated
            console.log(user);
            if (user != '0') {
                console.log(user);
                console.log("user found");
                $rootScope.currentUser = user;
                var username = user.username;
                UserService.getUserDetails(username, function (response) {
                    console.log(response);
                    $rootScope.userDetails = response;
                })
                deferred.resolve();
            } else {
                console.log("user not found");
                $rootScope.errorMessage = "you need to login";
                deferred.reject();
                $location.url("/login");
            }
        })
    .error(function (user) {
        console.log(user);
    });;
}