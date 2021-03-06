﻿app.controller("SignupController", function ($scope, $http, $rootScope, $location) {
    $scope.signup = function () {
        console.log($scope.userDetails);
        console.log($scope.userLogin);
        var usernameAlreadyExists = false;
        if($scope.userLogin.password != $scope.userLogin.cnfPassword){
            $scope.confirmPasswordMsg = true;
        }
        else {
            $http.get("/api/user")
                .success(function (response) {
                    $scope.users = response;
                    console.log(response);
                    for (var u in $scope.users) {
                        if ($scope.userLogin.username == $scope.users[u].username) {
                            usernameAlreadyExists = true;
                            break;
                        }
                    }
                    if (usernameAlreadyExists) {
                        $scope.invalidUsername = usernameAlreadyExists;
                    }
                    else {
                        $scope.userDetails.username = $scope.userLogin.username;
                        $http.post("/api/userDetails", $scope.userDetails)
                            .success(function (response) {
                                $http.post("/api/userLogin", $scope.userLogin).success(function (response) {
                                    var user = {
                                        username: $scope.userLogin.username,
                                        password: $scope.userLogin.password
                                    };
                                    $http.post("/api/login", user)
                                        .success(function (response) {
                                            $rootScope.currentUser = response;
                                            $scope.currentUser = response;
                                            $scope.invalid = false;
                                            $location.url("/profile/");
                                        })
                                        .error(function (response) {
                                            console.log("username or password is incorrect");
                                            $scope.invalid = true;
                                            console.log(response);
                                        });
                                });
                            })
                    }
                });
        }
    }

    $scope.change = function (response) {
        $scope.invalidUsername = false;
    }
});
