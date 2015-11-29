app.factory('UserService', function UserService($http) {

    var updateUserLogin = function (currentUserId, newUser, callback) {
        $http.put("/api/userLogin/" + currentUserId, newUser)
        .success(callback);
    }

    return {
        updateUserLogin: updateUserLogin
    }
});