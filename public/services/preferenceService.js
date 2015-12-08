app.factory('PreferenceService', function PreferenceService($http) {

    var getUserPreferences = function (username, callback) {
        $http.get("/api/findUserPreferences/" + username)
            .success(callback);
    };

    var updateUserPreferences = function (username, userDetails, callback) {
        $http.post("/api/updateUserPreferences/" + username, userDetails)
            .success(callback);
    }

    return {
        getUserPreferences: getUserPreferences,
        updateUserPreferences: updateUserPreferences
    }
});