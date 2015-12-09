app.controller("EventsController", function ($scope, $http, $rootScope, $location, $templateCache, MyEventsService) {
    $scope.currentUser = $rootScope.currentUser;
    var currentUser = $rootScope.currentUser;
    var userDetails= $rootScope.currentUser;


    //will hold the myEvents of the user
    var myEvents;
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
                        title: 'You are here',
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
                    //fetch user events only if the user is logged in
                    if ($scope.currentUser != null &&$rootScope.query == null)
                        fetchUserEvents();
                    if ($rootScope.query != null) {
                        $scope.query = $rootScope.query;
                        $rootScope.query = null;
                        fetch();
                    }
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
        var userPreferences = $rootScope.preferences;
        if (userPreferences == null)
            userPreferences = '';
        var searchQuery = url + '?categories=' + userPreferences + location +
            '&token=' + token + '&expand=venue,category';
        $scope.currentQuery = searchQuery;
        $scope.code = null;
        $scope.response = null;
        $scope.method = 'GET';

        search(searchQuery, true);
    }


    $scope.removeEvent = function (event) {
        var index = $scope.events.indexOf(event);
        $scope.events.splice(index, 1);
    }

    //method to pre-process the data retreived from the data api
    function processData(doPages) {
        $scope.categories = [];
        $scope.events = [];
        $scope.unfilteredEvents = [];
        //$scope.dates = [];
        var categoriesID = [];
        var j = 0;
        for (var i = 0; i < $scope.data.events.length; i++) {
            if ($scope.data.events[i].category != null && $scope.data.events[i].logo != null
                && $scope.data.events[i].venue != null) {
                $scope.unfilteredEvents[j] = $scope.data.events[i];
                $scope.events[j] = $scope.data.events[i];
                var start = (new Date($scope.events[j].start.local)).toString().substring(0, 25);
                var end = (new Date($scope.events[j].end.local)).toString().substring(0, 25);

                $scope.events[j].start.local = start;
                $scope.events[j].end.local = end;
                if ($scope.data.events[i].category != null) {
                    if (categoriesID.indexOf($scope.data.events[i].category.id) == -1) {
                        $scope.categories.push($scope.data.events[i].category);
                        categoriesID.push($scope.data.events[i].category.id);
                    }
                }
                j++;
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
    function fetch() {
        var radius = $scope.query.radius;
        var category = $scope.query.category;
        var startDate = $scope.query.startDate;
        var endDate = $scope.query.endDate;
        var city = $scope.query.city;
        var url = 'https://www.eventbriteapi.com/v3//events/search/';
        var token = 'JJJKFTCUFVWB2HPKT2DS';
        var token2 = 'QC44X66MUP27NDX7MDZL';
        var start = '';
        var end = '';
        var cat = '';
        var loc = '';
        var lat = $scope.latitude;
        var long = $scope.longitude;
        if (startDate != null && startDate != '') {
            start = '&start_date.range_start=' + startDate.substring(0, 19);
        }
        if (endDate != null && endDate != '') {
            end = '&start_date.range_end=' + endDate.substring(0, 19);
        }
        if (category != null && category != '') {
            cat = '&categories=' + category;
        }
        if (city != null && city != '') {
            loc = '&venue.city=' + city;
            var geocoder =  new google.maps.Geocoder();
            geocoder.geocode( { 'address': city}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    lat= results[0].geometry.location.lat();
                    long = results[0].geometry.location.lng();
                    var newLoc = new google.maps.LatLng(
                        lat,
                        long);
                    map.setCenter(newLoc);
                    var location = '&location.within=' + radius + 'mi&location.latitude=' + lat +
                        '&location.longitude=' + long + '&popular=on';

                    var searchQuery = url + '?q=' + $scope.query.key + location +
                        '&token=' + token + cat + start + end + loc +'&expand=venue,category';
                    $scope.currentQuery = searchQuery;
                    $scope.code = null;
                    $scope.response = null;
                    $scope.method = 'GET';

                    search(searchQuery, true);
                } else {
                    alert("Something got wrong " + status);
                }
            });
        } else {
            var location = '&location.within=' + radius + 'mi&location.latitude=' + lat +
                '&location.longitude=' + long + '&popular=on';

            var searchQuery = url + '?q=' + $scope.query.key + location +
                '&token=' + token + cat + start + end + loc + '&expand=venue,category';
            $scope.currentQuery = searchQuery;
            $scope.code = null;
            $scope.response = null;
            $scope.method = 'GET';

            search(searchQuery, true);
        }

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
    //page: flag to tell if pagination has to be rendered
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
                if (directionsDisplay)
                    directionsDisplay.setMap(null);
                directionsService = null;
                directionsDisplay = null;
                directionsService = new google.maps.DirectionsService;
                directionsDisplay = new google.maps.DirectionsRenderer({map: map});
                removeMarkers(marker);
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

    function removeMarkers(marker) {
        for (var i = 0; i < markers.length; i++) {

            markers[i].setMap(null);
        }
        markers = [];
        marker.setMap(map);
        //setMarkers();
    }

    $('#showAll').hide();

    //method to show all the events
    $scope.showall = function () {
        $scope.filterEvents('');
        map.setZoom(12);
        map.setCenter(userMarker.getPosition());
        directionsService = null;
        if (directionsDisplay)
            directionsDisplay.setMap(null);
        $('.eventRow').show();
        $('#showAll').hide();

        var savedDistance= $scope.distance;
        //alert(savedDistance);
        if(!savedDistance)
            savedDistance=5;
        $('#radius').slider('setValue', Number(savedDistance));
        $('#catFilter').val('');
        $('#dateFilter').val('');

    };

    //method to filter events shown
    $scope.filterEvents = function (type) {
        $('#showAll').show();
        var j = 0;
        if (type == '') {
            $scope.events = [];
            $scope.events = $scope.unfilteredEvents;
        }

        if (type == 'cat') {
            if ($scope.catFilter == '') {
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
            //resetMarkers();
        }
        if (type == 'date') {
            if ($scope.datFilter == '') {
                $scope.events = [];
                $scope.events = $scope.unfilteredEvents;
            } else {
                var date = getDate($scope.datFilter);
                $scope.events = [];
                if ($scope.datFilter == '1' || $scope.datFilter == '2') {
                    for (i = 0; i < $scope.unfilteredEvents.length; i++) {
                        if ($scope.unfilteredEvents[i].start.local.substring(0, 10) == date.toISOString().substring(0, 10)) {
                            $scope.events[j] = $scope.unfilteredEvents[i];
                            j++;
                        }
                    }
                } else if ($scope.datFilter == '3') {
                    for (i = 0; i < $scope.unfilteredEvents.length; i++) {
                        var temp = new Date($scope.unfilteredEvents[i].start.local);
                        if (temp >= date.d1
                            && temp <= date.d2) {
                            $scope.events[j] = $scope.unfilteredEvents[i];
                            j++;
                        }
                    }
                } else {
                    for (i = 0; i < $scope.unfilteredEvents.length; i++) {
                        if (new Date($scope.unfilteredEvents[i].start.local) >= date) {
                            $scope.events[j] = $scope.unfilteredEvents[i];
                            j++;
                        }
                    }
                }
            }

        }
        resetMarkers();

    };
    function getDate(type) {
        var dat = new Date();
        var dateRange;
        var d1;
        var d2;
        if (type == '1') {
            return dat;
        }
        if (type == '2') {
            dat.setDate(dat.getDate() + 1)
            return dat;
        }
        if (type == '3') {
            d2 = new Date();
            d2.setDate(dat.getDate() + 7);
            dateRange = {"d1": dat, "d2": d2};
            return dateRange;
        }
        if (type == '4') {
            dat.setDate(dat.getDate() + 7)
            return dat;
        }
        if (type == '5') {
            dat.setDate(dat.getDate() + 31)
            return dat;
        }
    }

    function calcDist(lat1, lat2, lon1, lon2) {
        //alert(lat1);
        var R = 6371000; // metres
        var φ1 = toRad(lat1);
        //alert(φ1);
        var φ2 = toRad(lat2);
        var Δφ = toRad(lat2 - lat1);
        var Δλ = toRad(lon2 - lon1);
        //alert(lat2);
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = ((R * c)/1000) * 0.62137;
        //alert(d);
        return d;
    }

    function toRad(num){
        return num * Math.PI / 180;
    }
    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRadians) === "undefined") {
        Number.prototype.toRadians = function() {
            return this * Math.PI / 180;
        }
    }

    $scope.addEventToFavorites = function (event) {
        var currentUser = $rootScope.currentUser;
        var username = currentUser.username;
        if (!myEvents)
            myEvents = [];
        var eventToBeUpdated = {
            eventId: event.id,
            eventName: event.name.text,
            eventUrl: event.url,
            imageUrl: event.logo.url,
            startDate: event.start.local,
            endDate: event.end.local,
            description: event.description.text,
            venueName: event.venue.name,
            venueAddress: event.venue.address.address_1,
            venueCity: event.venue.address.city,
            venueRegion: event.venue.address.region,
            venuePostalCode: event.venue.address.postal_code,
            venueCountry: event.venue.address.country
        };

        console.log(eventToBeUpdated);
        myEvents.push(eventToBeUpdated);
        console.log(myEvents);
        var myEventObj = {username: username, events: myEvents};
        MyEventsService.updateUserEvents(username, myEventObj, function (response) {
            myEvents = response.events;
            console.log(myEvents);
            /*$("#removeFromFavLink"+event.id).show();
            $("#addToFavLink"+event.id).hide();*/

        });
    };

    $scope.removeEventFromFavorites = function (event) {
        var username= $rootScope.currentUser.username;
        for (var me in myEvents) {
            if (event.id == myEvents[me].eventId) {
                console.log("Removing event with eventId-->"+event.id);
                myEvents.splice(me, 1);
            }
        }
        var myEventObj= {username: username, events: myEvents};
        MyEventsService.updateUserEvents(currentUser.username, myEventObj, function (response) {
            myEvents=response.events;
            console.log(myEvents);
            /*$("#removeFromFavLink"+event.id).hide();
            $("#addToFavLink"+event.id).show();*/
        });
    };

    $scope.isEventAFav = function (event) {
        for (var me in myEvents) {
            //console.log(myEvents[me].eventId);
            if (event.id == myEvents[me].eventId) {
                return true;
            }
        }
        return false;
    }

    $scope.distanceFilter = function distanceFilter() {
        //console.log('onslide:' + $scope.unfilteredEvents);

        var rad = $("#radius").val();
        $('#showAll').show();
        $scope.events = [];
        var j = 0;
        //alert(rad);
        for (i = 0; i < $scope.unfilteredEvents.length; i++) {
            //alert('in loop'+$scope.unfilteredEvents[i].venue);
            if ($scope.unfilteredEvents[i].venue != undefined) {
                var lat1 = $scope.unfilteredEvents[i].venue.address.latitude;
                var lon1 = $scope.unfilteredEvents[i].venue.address.longitude;
                var lat2 = userMarker.getPosition().lat();
                var lon2 = userMarker.getPosition().lng();
                var calDist = calcDist(Number(lat1), Number(lat2), Number(lon1), Number(lon2));
                //alert(calDist);
                if (calDist <= rad) {
                    $scope.events[j] = $scope.unfilteredEvents[i];
                    j++;
                }
            }
        }
        resetMarkers();
    }

    $scope.mailEvent = function (event) {
        var userDetails= $rootScope.userDetails;
        console.log(userDetails);
        var toMail = userDetails.email;
        var payload = { name: userDetails.firstName,
            email: userDetails.email,
            username: userDetails.username,
            eventName: event.name.text,
            eventUrl: event.url,
            imageUrl: event.logo.url,
            startDate: event.start.local,
            endDate: event.end.local,
            description: event.description.text,
            venueName: event.venue.name,
            venueAddress: event.venue.address.address_1,
            venueCity: event.venue.address.city,
            venueRegion: event.venue.address.region,
            venuePostalCode: event.venue.address.postal_code,
            venueCountry: event.venue.address.country
        };
        console.log(toMail);
        $('#alertMessage').show();
        $http.post("/api/mailEvent", payload)
            .success(function (response) {
                console.log("mail sent");
            })
            .error(function (response) {
                console.log("mail not sent");
            });
    }


    $(document).ready(function () {
        $('#alertMessage').hide();
        $('#preferences').val($scope.preferences);
        var savedDistance = $scope.distance;
        if (!savedDistance)
            savedDistance = 5;
        $('#radius').slider('setValue', Number(savedDistance));
        if(!currentUser && currentUser!=null) {
            var username = currentUser.username;
            console.log(username);
            MyEventsService.getUserEvents(username, function (response) {
                if (response) {
                    $scope.myEvents = response.events;
                    console.log(response);
                    console.log(response.events);
                    myEvents = response.events;
                }
            });
        }
    });


});

