app.controller("LoginController", function ($scope, $http, $rootScope, $location) {
    $scope.currentUser = null;
    $rootScope.currentUser = null;
    $scope.invalid = false;

    $scope.login = function (user) {
        $http.post("/api/login", user)
         .success(function (response) {
             console.log(response);
             $rootScope.currentUser = response;
             $scope.currentUser = response;
             $scope.invalid = false;
             $location.url("/events/");
         })
         .error(function (response) {
             console.log("username or password is incorrect");
             $scope.invalid = true;
             console.log(response);
         });
    }
    $scope.change = function (response) {
        $scope.invalid = false;
    }
});