app.factory('UserService', function UserService($http) {

    var updateUserLogin = function (currentUserId, newUser, callback) {
        $http.put("/api/userLogin/" + currentUserId, newUser)
        .success(callback);
    }

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

    /*var getUserPreferences = function (username, callback) {
        $http.get("/api/findUserPreferences/" + username)
            .success(callback);
    };

    var updateUserPreferences = function (username, userDetails, callback) {
        $http.post("/api/updateUserPreferences/" + username, userDetails)
            .success(callback);
    }*/

    return {
        updateUserLogin: updateUserLogin,
        deleteUser: deleteUser,
        getUserDetails: getUserDetails,
        updateUserDetails: updateUserDetails
        /*,
        getUserPreferences: getUserPreferences,
        updateUserPreferences: updateUserPreferences*/
    }
});