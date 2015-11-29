app.controller("EventsController", function ($scope, $http, $rootScope, $location,uiGmapGoogleMapApi,$templateCache) {
    var userLat;
    var userLong;
    uiGmapGoogleMapApi.then(function(maps) {
        //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        navigator.geolocation.getCurrentPosition(function(pos) {
            //alert(pos.coords.longitude);
            userLat = pos.coords.latitude;
            userLong = pos.coords.longitude;
            $scope.map = { center: { latitude: userLat, longitude: userLong }, zoom: 15 };
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: userLat,
                    longitude: userLong
                }
            };
            $scope.options = {icon:'../../images/blue.png'};
            //$scope.loading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
        //alert(userLat);
    });
    $scope.fetch = function() {
        var url= 'https://www.eventbriteapi.com/v3//events/search/';
        var token = 'JJJKFTCUFVWB2HPKT2DS';
        var token2 = 'QC44X66MUP27NDX7MDZL';
        //*var batchurl = "https://www.eventbriteapi.com/v3/batch/" + '?token=' + token;
        //var venueURL = '{"method":"GET", "relative_url":"venues/';

        var searchQuery = url + '?q=' + $scope.query + '&token=' + token + '&expand=venue';
        //var venues = [];
        //var batchRequest = '[' + venueURL;
        $scope.code = null;
        $scope.response = null;
        $scope.method = 'GET';

        //to fetch all the events
        $http({method: $scope.method, url: searchQuery, cache: $templateCache}).
        then(function(response) {
            $scope.status = response.status;
            $scope.data = response.data;
            alert($scope.data.events.length);
            //updatemap($scope.data);
            $scope.markers = [];
            for(var i=0;i<$scope.data.events.length;i++){
                if(i==10){
                    break;
                }
                $scope.markers[i] =
                {
                    id:'marker'+i,
                    coords: {
                        latitude: $scope.data.events[i].venue.address.latitude,
                        longitude: $scope.data.events[i].venue.address.longitude
                    },
                    icon :'../../images/green.png',
                    show :true
                };
            }
            alert($scope.markers);
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
        });

    };

    function updatemap(data){
        $scope.markers = [];
        alert(data.length);
        for(var i=0;i<data.length;i++){

            $scope.markers[i] =
            {
                id:'marker'+i,
                coords: {
                    latitude: data[i].event.venue.address.latitude,
                    longitude: data[i].event.venue.address.longitude
                },
                icon :'../../images/green.png',
                show :true
            };
        }
        alert($scope.markers);
    }
});

