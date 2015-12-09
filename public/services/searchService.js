app.factory('searchService', function UserService($http) {
    var searchData = function (query) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                alert(query);
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var url = 'https://www.eventbriteapi.com/v3//events/search/';
                var token = 'JJJKFTCUFVWB2HPKT2DS';
                var token2 = 'QC44X66MUP27NDX7MDZL';
                var location = '&location.within=5mi&location.latitude=' + latitude +
                    '&location.longitude=' + longitude + '&popular=on';

                var searchQuery = url + '?q=' + query + location +
                    '&token=' + token + '&expand=venue,category';

                $http({method: $scope.method, url: searchQuery, cache: $templateCache}).
                then(function (response) {
                    $scope.status = response.status;
                    $scope.data = response.data;
                    if ($scope.data != null) {
                        $location.url("/events");
                    }
                }, function (response) {
                    $scope.data = response.data || "Request failed";
                    $scope.status = response.status;
                });
                $location.url("/events");
            });
    }

    return {
        searchData: searchData,
    }
});
