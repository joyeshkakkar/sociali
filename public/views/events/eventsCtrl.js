app.controller("EventsController", function ($scope, $http, $rootScope, $location,$templateCache) {

    var map;
    var userMarker;
    var markers = [];
    var loadEvents = true;
    var directionsService;
    var directionsDisplay;
    //method to load events as soon as user logs in
    $scope.loadUserEvents = function(){
        //setting up the map]

            var myCenter = new google.maps.LatLng(40.69847032728747,
                -73.9514422416687);
            var browserSupportFlag = new Boolean();

            //initializing the map
            //function initialize() {
            var mapProp = {
                center : myCenter,
                zoom : 12,
                mapTypeId : google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map"),
                mapProp);
            //getting users current location
            if (navigator.geolocation) {
                browserSupportFlag = true;
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        $scope.latitude=position.coords.latitude;
                        $scope.longitude=position.coords.longitude;
                        initialLocation = new google.maps.LatLng(
                            position.coords.latitude,
                            position.coords.longitude);
                        map.setCenter(initialLocation);
                        var marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position : initialLocation,
                            title: 'lat:'+position.coords.latitude+' long:'+position.coords.longitude,
                            //icon : 'images/blue.png'
                        });
                        marker.setMap(map);
                        userMarker = marker;
                        //to zoom
                        google.maps.event.addListener(marker, 'click',
                            function() {
                                map.setZoom(15);
                                map.setCenter(marker.getPosition());
                            });
                        fetchUserEvents();
                    }, function() {
                        handleNoGeolocation(browserSupportFlag);
                    });
            }
            // Browser doesn't support Geolocation
            else {
                browserSupportFlag = false;
                handleNoGeolocation(browserSupportFlag);
            }
            function handleNoGeolocation(errorFlag) {
                alert("NoGeoLocation-->"+errorFlag);
                if (errorFlag == true) {
                    alert("Geolocation service failed.");
                    initialLocation = myCenter;
                } else {
                    alert("Your browser doesn't support geolocation. We've placed you in newyork.");
                    initialLocation = myCenter;
                }
                map.setCenter(initialLocation);
                var marker = new google.maps.Marker({
                    position : initialLocation,
                    icon : 'images/green.png'
                });
                userMarker = marker;
                marker.setMap(map);
                //to zoom
                google.maps.event.addListener(marker, 'click', function() {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                });
                fetchUserEvents();
            }
            //}

        };

    function fetchUserEvents(){
        //google.maps.event.addDomListener(window, 'load', initialize);
        var url= 'https://www.eventbriteapi.com/v3//events/search/';
        var token = 'JJJKFTCUFVWB2HPKT2DS';
        var token2 = 'QC44X66MUP27NDX7MDZL';
        var location = '&location.within=5mi&location.latitude='+$scope.latitude+'&location.longitude='
            +$scope.longitude+'&popular=on';

        //setting category 103--music
        var searchQuery = url + '?categories=103' + location +
            '&token=' + token + '&expand=venue,category';
        $scope.code = null;
        $scope.response = null;
        $scope.method = 'GET';

        //to fetch all the events
        $http({method: $scope.method, url: searchQuery, cache: $templateCache}).
        then(function(response) {
            $scope.status = response.status;
            $scope.data = response.data;
            if ($scope.data != null) {
                processData();
                resetMarkers();
            }
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
        });
    }

    function processData(){
        $scope.categories = [];
        $scope.pages = [];
        for (var i = 0; i < $scope.data.events.length; i++) {
            if ($scope.categories.indexOf($scope.data.events[i].category.name) == -1)
                $scope.categories.push($scope.data.events[i].category.name);
        }
        for (var j = 1; j <= $scope.data.pagination.page_count; j++) {
            $scope.pages.push(j);
        }
    }
    $scope.fetchShowEvents = function(){
        //alert("In fetchShowEvents method with parameter-->"+$scope.query);
        //var returnValue= fetch();
        loadEvents=false;
        //$scope.fetch();
            //alert("setting url");
            $location.url("/events/");

    };

    //method to fetch the events searced for
    $scope.fetch = function() {
        //alert("in fetch method--->"+$scope.query);
        var url= 'https://www.eventbriteapi.com/v3//events/search/';
        var token = 'JJJKFTCUFVWB2HPKT2DS';
        var token2 = 'QC44X66MUP27NDX7MDZL';
        var location = '&location.within=5mi&location.latitude='+$scope.latitude+
            '&location.longitude='+$scope.longitude+'&popular=on';
        //*var batchurl = "https://www.eventbriteapi.com/v3/batch/" + '?token=' + token;
        //var venueURL = '{"method":"GET", "relative_url":"venues/';

        var searchQuery = url + '?q=' + $scope.query + location +
            '&token=' + token + '&expand=venue,category';
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
            if ($scope.data != null){
                resetMarkers();
                processData();
            }
        }, function(response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
        });

    };


    //to set event markers
    function setMarkers() {
        for (var i = 0; i < $scope.data.events.length; i++) {

            var event = $scope.data.events[i];
            if (event.venue != null) {
                var infowindow = new google.maps.InfoWindow({
                    content: event.name.text
                });
                var myLatLng = new google.maps.LatLng(event.venue.address.latitude, event.venue.address.longitude);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: event.name.text,
                    icon: '../../images/green.png'
                });

                /*marker.addListener('mouseover', function() {
                    infowindow.open(map, marker);
                });*/
                markers.push(marker);
            }
        }

        setMarkerListeners();
    }

    function setMarkerListeners() {

        for (var i=0; i<markers.length; i++) {
            var event = $scope.data.events[i];
            var marker = markers[i];
            var infowindow = new google.maps.InfoWindow();
            bindInfoWindow(marker,infowindow,event,i);
        }
    }

    function bindInfoWindow(marker, infowindow, event,num) {
        google.maps.event.addListener(marker, 'click', (function (marker, num) {
            return function () {

                infowindow.setContent(event.name.text);
                infowindow.open(map, marker);
                map.setZoom(15);
                map.setCenter(marker.getPosition());
                hideOthers(event.id);
                // Instantiate a directions service.
                directionsService = new google.maps.DirectionsService;
                directionsDisplay = new google.maps.DirectionsRenderer({map: map});
                calculateAndDisplayRoute(marker.getPosition());
            }
        })(marker, num));
    }


    function calculateAndDisplayRoute(destination) {
        directionsService.route({
            origin: userMarker.getPosition(),
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    //reset any previous markers if available
    function resetMarkers(){
        for (var i=0; i<markers.length; i++) {

            markers[i].setMap(null);
        }
        markers = [];
        setMarkers();
    }

    function hideOthers(id){
        $('.eventRow').hide();
        $('#'+id).show();
        $('#showAll').show();
    }

    $scope.showall = function(){
        map.setZoom(12);
        map.setCenter(userMarker.getPosition());
        directionsService = null;
        directionsDisplay.setMap(null);
        $('.eventRow').show();
        $('#showAll').hide();
    };

    $scope.getNumber = function(num){
        //alert(num);
        if(num !=undefined)
            return new Array(+num);
    }

});

