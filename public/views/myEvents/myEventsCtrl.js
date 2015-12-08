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
        console.log(myEvents.length);
        for (var me in myEvents) {
            if (event.eventId == myEvents[me].eventId) {
                console.log("Removing event with eventId-->"+event.eventId);
                myEvents.splice(me, 1);
            }
        }
        console.log(myEvents.length);
        var myEventObj= {username: username, events: myEvents};
        MyEventsService.updateUserEvents(username, myEventObj, function (response) {
            console.log(response);
        });
    };

    $scope.mailEvent = function (event) {
        var userDetails= $rootScope.userDetails;
        console.log(userDetails);
        var toMail = userDetails.email;
        var payload = { name: userDetails.firstName + " " + userDetails.lastName,
            email: userDetails.email,
            username: userDetails.username,
            eventName: event.eventName,
            eventUrl: event.eventUrl,
            imageUrl: event.imageUrl,
            startDate: event.startDate,
            endDate: event.endDate,
            description: event.description,
            venueName: event.venueName,
            venueAddress: event.venueAddress,
            venueCity: event.venueCity,
            venueRegion: event.venueRegion,
            venuePostalCode: event.venuePostalCode,
            venueCountry: event.venueCountry
        };
        console.log(toMail);
        $http.post("/api/mailEvent", payload)
            .success(function (response) {
                console.log("mail sent");
            })
            .error(function (response) {
                console.log("mail not sent");
            });
    }


});