app.controller("ProfileController", function ($scope, $http, $rootScope, $scope, $location, UserService) {
    $scope.currentUser = $rootScope.currentUser;

    $scope.view_tab = 'updateProfile';
    $scope.changeTab = function (tab) {
        $scope.view_tab = tab;
        $scope.showPasswordSavedMsg = null;
    }

    $scope.cancelEdit = function(){
        $(".makeEditable").attr("disabled", "disabled");
        $("#editBtn").show();
        $("#updtUser").hide();
        $("#cancelEditBtn").hide();
    }

    $(document).ready(function () {
        $("#updtUser").hide();
        $("#cancelEditBtn").hide();

        $("#editBtn").click(function () {
            $(".makeEditable").removeAttr("disabled");
            $("#editBtn").hide();
            $("#updtUser").show();
            $("#cancelEditBtn").show();
        });
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

    $scope.change = function (response) {
        $scope.showPasswordSavedMsg = null;
    }

    $scope.updateUser = function () {
        var userDetails = $rootScope.userDetails;
        UserService.updateUserDetails($rootScope.currentUser.username, userDetails, function (response) {
            $scope.saved = true;
            $(".makeEditable").attr("disabled", "disabled");
            $("#editBtn").show();
            $("#updtUser").hide();
            $("#cancelEditBtn").hide();
        })
    };

    $scope.deleteProfile = function () {
        UserService.deleteUser($rootScope.currentUser._id, function (response) {
            console.log(response);
            console.log("Calling Logout");
            $http.post("/api/logout").success(function (response) {
                console.log("After Logout");
                $scope.currentUser = null;
                $rootScope.currentUser = null;
                $scope.userLogin = null;
                $scope.userDetails = null;
                $rootScope.userDetails = null;
                $location.url('/');
            });
        })
    };
});