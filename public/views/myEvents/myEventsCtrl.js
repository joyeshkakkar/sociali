app.controller("MyEventsController", function ($scope, $http, $rootScope, MyEventsService) {
    $scope.currentUser = $rootScope.currentUser;
    var username=$scope.currentUser.username;
    var myEvents;

    MyEventsService.getUserEvents(username, function(response){
        if(response){
            $scope.events = response.events;
            myEvents=response.events;
            console.log($scope.events);
        }
    });

    $scope.removeEventFromFavorites = function (event) {
        var username= $rootScope.currentUser.username;
        console.log(myEvents);
        for (var me in myEvents) {
            if (event.eventId == myEvents[me].eventId) {
                console.log("Removing event with eventId-->"+event.eventId);
                myEvents.splice(me, 1);
            }
        }
        var myEventObj= {username: username, events: myEvents};
        MyEventsService.updateUserEvents(username, myEventObj, function (response) {
            console.log(response);
            var index = $scope.events.indexOf(event);
            $scope.events.splice(index, 1);
        });
    };

});