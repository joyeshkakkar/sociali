app.factory('UserService', function UserService($http) {

    var updateUserLogin = function (currentUserId, newUser, callback) {
        $http.put("/api/userLogin/" + currentUserId, newUser)
        .success(callback);
    }

    var deleteUser = function (currentUserId, callback) {
        $http.delete("/api/deleteUser/" + currentUserId)
        .success(callback);
    }

    return {
        updateUserLogin: updateUserLogin,
        deleteUser: deleteUser
    }
});