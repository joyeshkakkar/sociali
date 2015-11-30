app.factory('AuthenticationService', function AuthenticationService($http) {

    var login = function (user, response) {
        alert("In Authentication Service");
        $http.post("/api/login", user)
            .success(response)
            .error(function (response) {
                console.log("username or password is incorrect");
                $scope.invalid = true;
                console.log(response);
            });
    }

/*
    var deleteUser = function (currentUserId, callback) {
        $http.delete("/api/deleteUser/" + currentUserId)
            .success(callback);
    }

    var getUserDetails = function (username, callback) {
        $http.get("/api/findUserDetails/" + username)
            .success(callback);
    };

    var updateUserDetails = function (username, userDetails, callback) {
        $http.post("/api/updateUserDetails/" + username, userDetails)
            .success(callback);
    }
*/

    return {
        login: login
        /*,
        logout: logout,
        signup: signup,
        checkUserLoggedin: checkUserLoggedin*/
    }
});