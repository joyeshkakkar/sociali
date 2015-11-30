app.controller("EventsController", function ($scope, $http, $rootScope, $location,$templateCache) {

    var map;
    var markers = [];
    var loadEvents = true;
    //method to load events as soon as user logs in
    $scope.loadUserEvents = function(){
        //setting up the map]
        //alert("in load user events--">+loadEvents);


            var myCenter = new google.maps.LatLng(40.69847032728747,
                -73.9514422416687);
            var browserSupportFlag = new Boolean();

            //initializing the map
            //function initialize() {
            var mapProp = {
                center : myCenter,
                zoom : 10,
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
                        //to zoom
                        google.maps.event.addListener(marker, 'click',
                            function() {
                                map.setZoom(15);
                                map.setCenter(marker.getPosition());
                            });

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
                marker.setMap(map);
                //to zoom
                google.maps.event.addListener(marker, 'click', function() {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                });
            }
            //}
            //google.maps.event.addDomListener(window, 'load', initialize);
            var url= 'https://www.eventbriteapi.com/v3//events/search/';
            var token = 'JJJKFTCUFVWB2HPKT2DS';
            var token2 = 'QC44X66MUP27NDX7MDZL';
            var location = '&location.within=5mi&location.latitude='+'42.3372703'+'&location.longitude='+'-71.0913595';

            //setting category 103--music
            var searchQuery = url + '?categories=103' + location +
                '&token=' + token + '&expand=venue';
            $scope.code = null;
            $scope.response = null;
            $scope.method = 'GET';

            //to fetch all the events
            $http({method: $scope.method, url: searchQuery, cache: $templateCache}).
            then(function(response) {
                $scope.status = response.status;
                $scope.data = response.data;
                if($scope.data != null)
                    resetMarkers();
            }, function(response) {
                $scope.data = response.data || "Request failed";
                $scope.status = response.status;
            });
        };



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
        var location = '&location.within=5mi&location.latitude='+$scope.latitude+'&location.longitude='+$scope.longitude;
        //*var batchurl = "https://www.eventbriteapi.com/v3/batch/" + '?token=' + token;
        //var venueURL = '{"method":"GET", "relative_url":"venues/';

        var searchQuery = url + '?q=' + $scope.query + location +
            '&token=' + token + '&expand=venue';
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
            if($scope.data != null)
                resetMarkers();
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
            }
        })(marker, num));
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
        //$('.eventRow').show();
        $('.eventRow').hide();
        $('#'+id).show();
        $('#showAll').show();
    }

    $scope.showall = function(){
        $('.eventRow').show();
        $('#showAll').hide();
    };

});

