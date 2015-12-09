app.controller("SearchController", function ($scope, $http, $rootScope, $location, $templateCache,$route) {

    $scope.key='';
    $scope.category='';

    //method to set search parameters
    $scope.searchEvents = function () {
        if($("#strtD").val() != undefined && $("#strtD").val() != ''){
            var start = new Date($("#strtD").val()).toISOString();
        }
        if($("#endD").val() != undefined && $("#endD").val() != ''){
            var end = new Date($("#endD").val()).toISOString();
        }
        var query = {

            "key": $scope.key,
            "city": $('#location').val(),
            "category": $scope.category,
            "radius": $("#distance").val(),
            "startDate":start,
            "endDate": end
        }
        alert($scope.city);
        $rootScope.query = query;
        if($location.path() == '/events'){
            $route.reload();
        }
        //alert('url:'+ $location.path());
        $location.url("/events");
    }

});