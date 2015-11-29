app.controller("LogoutController", function ($scope, $http, $rootScope, $location) {
    $http.post("/api/logout").success(
        function(response){
            $scope.currentUser = null;
            $rootScope.currentUser = null;
            $scope.userLogin = null;
            $location.url('/');
            //window.location.reload();
        }
    );
});