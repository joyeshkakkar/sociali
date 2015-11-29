app.controller("ProfileController", function ($scope, $http, $rootScope, $location, UserService) {
    $scope.currentUser = $rootScope.currentUser;

    $scope.view_tab = 'updateProfile';
    $scope.changeTab = function (tab) {
        $scope.view_tab = tab;
        $scope.showPasswordSavedMsg = null;
    }

    $(document).ready(function () {
        $("#updtUser").hide();

        $("#editBtn").click(function () {
            $(".makeEditable").removeAttr("disabled");
            $("#editBtn").hide();
            $("#updtUser").show();
        });

        /*$("#saveBtn").click(function () {
            $("#updateProfileForm").submit();
        });*/
    });

    $scope.changePassword = function (newPassword) {
        var currentUser = $rootScope.currentUser;
        var newUser = { username: currentUser.username, password: newPassword };
        UserService.updateUserLogin(currentUser._id, newUser, function (response) {
            console.log(response);
            $scope.currentUser = response;
            $scope.showPasswordSavedMsg = "Your password is changed. Thanks!";
            $scope.password = '';
            $scope.cnfPassword = '';
        })
    };

    $scope.getDet = function () {
        $http.get("/api/findUserDetails/" + $rootScope.currentUser.username)
            .success(function (response) {
                $scope.userDetails = response;
            })
    };

    $scope.change = function (response) {
        $scope.showPasswordSavedMsg = null;
    }

    $scope.updateUser = function () {
        console.log($scope.userDetails);
        console.log($scope.userLogin);
        $http.post("/api/updateUserDetails/" + $rootScope.currentUser.username, $scope.userDetails)
            .success(function (response) {
                $scope.saved = true;
                $(".makeEditable").attr("disabled", "disabled");
                $("#editBtn").show();
                $("#updtUser").hide();
            });
    }

    $scope.deleteProfile = function () {
        UserService.deleteUser($rootScope.currentUser._id, function (response) {
            console.log(response);
            console.log("Calling Logout");
            $http.post("/api/logout").success(function (response) {
                console.log("After Logout");
                $scope.currentUser = null;
                $rootScope.currentUser = null;
                $scope.userLogin = null;
                $location.url('/');
            });
        })
    };

});