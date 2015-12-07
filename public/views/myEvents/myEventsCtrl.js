app.controller("MyEventsController", function ($scope, $http, $rootScope, MyEventsService) {
    $scope.currentUser = $rootScope.currentUser;
    var username=$scope.currentUser.username;
    //$scope.events=$rootScope.myEvents;

    MyEventsService.getUserEvents(username, function(response){
        if(response){
            $scope.events = response.events;
            console.log($scope.events);
        }
    });

});