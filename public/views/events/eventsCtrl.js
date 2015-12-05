app.controller("EventsController", function ($scope, $http, $rootScope, $location, $templateCache) {

    //will hold the map instance for the page
    var map;
    //will hold the user location marker
    var userMarker;
    //will hold all the envent markers
    var markers = [];
    var loadEvents = true;
    //holds google directions service object
    var directionsService;
    //holds the directions display object
    var directionsDisplay;

    //method to load events as soon as user logs in
    $scope.loadUserEvents = function () {

        //setting up the map
        //default center to be used if getting geo location fails
        var myCenter = new google.maps.LatLng(42.3389,
            -71.0903);
        var browserSupportFlag = new Boolean();

        //initializing the map
        var mapProp = {
            center: myCenter,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //creating the map object
        map = new google.maps.Map(document.getElementById("map"),
            mapProp);

        //check if geo location is supported
        if (navigator.geolocation) {
            browserSupportFlag = true;

            //getting users current location
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                    initialLocation = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude);
                    //setting map's center
                    map.setCenter(initialLocation);
                    //creating user's marker
                    var marker = new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        position: initialLocation,
                        title: 'lat:' + position.coords.latitude + ' long:' + position.coords.longitude,
                        //icon : 'images/blue.png'
                    });
                    marker.setMap(map);
                    userMarker = marker;
                    //to zoom on click
                    google.maps.event.addListener(marker, 'click',
                        function () {
                            map.setZoom(15);
                            map.setCenter(marker.getPosition());
                        });
                    fetchUserEvents();
                }, function () {
                    handleNoGeolocation(browserSupportFlag);
                });
        }
        // Browser doesn't support Geolocation
        else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
        }
        function handleNoGeolocation(errorFlag) {
            alert("NoGeoLocation-->" + errorFlag);
            if (errorFlag == true) {
                alert("Geolocation service failed.");
                initialLocation = myCenter;
            } else {
                alert("Your browser doesn't support geolocation. We've placed you in newyork.");
                initialLocation = myCenter;
            }
            map.setCenter(initialLocation);
            var marker = new google.maps.Marker({
                position: initialLocation,
                icon: 'images/green.png'
            });
            userMarker = marker;
            marker.setMap(map);
            //to zoom
            google.maps.event.addListener(marker, 'click', function () {
                map.setZoom(15);
                map.setCenter(marker.getPosition());
            });
            fetchUserEvents();
        }

        //}

    };

    //method to fetch user events on user login based on preferences
    function fetchUserEvents() {
        var url = 'https://www.eventbriteapi.com/v3//events/search/';
        var token = 'JJJKFTCUFVWB2HPKT2DS';
        var token2 = 'QC44X66MUP27NDX7MDZL';
        var location = '&location.within=5mi&location.latitude=' + $scope.latitude + '&location.longitude='
            + $scope.longitude + '&popular=on';

        //setting category 103--music
        var searchQuery = url + '?categories=103' + location +
            '&token=' + token + '&expand=venue,category';
        $scope.currentQuery = searchQuery;
        $scope.code = null;
        $scope.response = null;
        $scope.method = 'GET';

        search(searchQuery, true);
    }

    //method to pre-process the data retreived from the data api
    function processData(doPages) {
        $scope.categories = [];
        $scope.events = [];
        $scope.unfilteredEvents = [];
        //$scope.dates = [];
        var categoriesID = [];
        for (var i = 0; i < $scope.data.events.length; i++) {
            $scope.unfilteredEvents[i] = $scope.data.events[i];
            $scope.events[i] = $scope.data.events[i];
            if ($scope.data.events[i].category != null) {
                if (categoriesID.indexOf($scope.data.events[i].category.id) == -1) {
                    $scope.categories.push($scope.data.events[i].category);
                    categoriesID.push($scope.data.events[i].category.id);
                }
            }
        }
        if (doPages) {
            $scope.currentPage = 1;
            $scope.pages = [];
            for (var j = 1; j <= $scope.data.pagination.page_count; j++) {
                $scope.pages.push(j);
            }
        }
    }

    $scope.fetchShowEvents = function () {
        //alert("In fetchShowEvents method with parameter-->"+$scope.query);
        //var returnValue= fetch();
        loadEvents = false;
        //$scope.fetch();
        //alert("setting url");
        $location.url("/events/");

    };

    //method to fetch the events searced for
    $scope.fetch = function () {
        var url = 'https://www.eventbriteapi.com/v3//events/search/';
        var token = 'JJJKFTCUFVWB2HPKT2DS';
        var token2 = 'QC44X66MUP27NDX7MDZL';
        var location = '&location.within=5mi&location.latitude=' + $scope.latitude +
            '&location.longitude=' + $scope.longitude + '&popular=on';

        var searchQuery = url + '?q=' + $scope.query + location +
            '&token=' + token + '&expand=venue,category';
        $scope.currentQuery = searchQuery;
        $scope.code = null;
        $scope.response = null;
        $scope.method = 'GET';

        search(searchQuery, true);

    };

    //method to perform page navigation
    $scope.fetchNextPage = function (num) {
        if (num > 0 && num <= $scope.pages.length) {
            $scope.currentPage = num;
            var searchQuery = $scope.currentQuery;
            searchQuery = searchQuery + '&page=' + num;
            $scope.code = null;
            $scope.response = null;
            $scope.method = 'GET';

            search(searchQuery, false);
        }
    };

    //perform all search operations
    //searchQuery: query to be posted
    //page: flag to tell if pagination has to rendered
    function search(searchQuery, page) {
        $http({method: $scope.method, url: searchQuery, cache: $templateCache}).
        then(function (response) {
            $scope.status = response.status;
            $scope.data = response.data;
            if ($scope.data != null) {
                processData(page);
                resetMarkers();
            }
        }, function (response) {
            $scope.data = response.data || "Request failed";
            $scope.status = response.status;
        });
    }

    //to set event markers
    function setMarkers() {
        for (var i = 0; i < $scope.events.length; i++) {

            var event = $scope.events[i];
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

    //add click listeners to all the markers
    function setMarkerListeners() {

        for (var i = 0; i < $scope.events.length; i++) {
            var event = $scope.events[i];
            var marker = markers[i];
            var infowindow = new google.maps.InfoWindow();
            bindInfoWindow(marker, infowindow, event, i);
        }
    }

    //bind info windows to all the event markers
    function bindInfoWindow(marker, infowindow, event, num) {
        google.maps.event.addListener(marker, 'click', (function (marker, num) {
            return function () {

                //infowindow.setContent(event.name.text);
                //infowindow.open(map, marker);
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


    //method to calculate and display the route
    function calculateAndDisplayRoute(destination) {
        directionsService.route({
            origin: userMarker.getPosition(),
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    //reset any previous markers if available
    function resetMarkers() {
        for (var i = 0; i < markers.length; i++) {

            markers[i].setMap(null);
        }
        markers = [];
        setMarkers();
    }

    //method to hide all events when one is chosen
    function hideOthers(id) {
        $('.eventRow').hide();
        $('#' + id).show();
        $('#showAll').show();
    }

    //method to show all the events
    $scope.showall = function () {
        map.setZoom(12);
        map.setCenter(userMarker.getPosition());
        directionsService = null;
        directionsDisplay.setMap(null);
        $('.eventRow').show();
        $('#showAll').hide();
    };

    //method to filter events shown
    $scope.filterEvents = function (type) {
        var j=0;
        if(type == 'cat'){
            if($scope.catFilter == ''){
                $scope.events = [];
                $scope.events = $scope.unfilteredEvents;
            } else {
                $scope.events = [];
                for (i = 0; i < $scope.unfilteredEvents.length; i++) {
                    if ($scope.unfilteredEvents[i].category != null &&
                            $scope.unfilteredEvents[i].category.id == $scope.catFilter) {
                        $scope.events[j] = $scope.unfilteredEvents[i];
                        j++;
                    }
                }
            }
            //processData(false);
            resetMarkers();
        }

    };


});

