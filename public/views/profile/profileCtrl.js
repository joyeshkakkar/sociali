app.controller("ProfileController", function ($scope, $http, $rootScope, $location, UserService) {

    $scope.currentUser = $rootScope.currentUser;
    $scope.preferences = $rootScope.preferences;
    $scope.distance = $rootScope.distance;

    $scope.view_tab = 'updatePreferences';
    $scope.changeTab = function (tab) {
        $scope.view_tab = tab;
        $scope.showPasswordSavedMsg = null;
        $scope.confirmPasswordMsg = null;
        $scope.updateProfileMsg = null;
        $scope.updatePrefMsg = null;
    };

    $scope.cancelEdit = function(){
        $(".makeEditable").attr("disabled", "disabled");
        $("#editBtn").show();
        $("#updtUser").hide();
        $("#cancelEditBtn").hide();
    };

    $scope.changePassword = function (newPassword,cnfPassword,currPassword) {
        var currentUser = $rootScope.currentUser;
        if(currentUser.password != currPassword){
            $scope.confirmPasswordMsg = 'Current password does not match.';
        }
        else{
            if((newPassword != undefined ) && (cnfPassword != undefined) ){

                if(newPassword != cnfPassword) {
                    $scope.confirmPasswordMsg = "Passwords don't match.";
                    $scope.showPasswordSavedMsg = null;
                }
                else {
                    var newUser = {username: currentUser.username, password: newPassword};
                    UserService.updateUserLogin(currentUser._id, newUser, function (response) {
                        console.log(response);
                        $scope.currentUser = response;
                        $scope.showPasswordSavedMsg = "Your password is changed. Thanks!";
                        $scope.confirmPasswordMsg = null;
                        $scope.password = '';
                        $scope.cnfPassword = '';
                        $scope.currPassword = '';
                    })
                }
            }
        }
    };

    $scope.change = function (response) {
        $scope.showPasswordSavedMsg = null;
        $scope.confirmPasswordMsg = null;
        $scope.updateProfileMsg = null;
        $scope.updatePrefMsg = null;
    };

    $scope.updateUser = function () {
        var userDetails = $rootScope.userDetails;
        if((userDetails.firstName!= undefined) && (userDetails.lastName!= undefined) && (userDetails.email!= undefined))
        {
            UserService.updateUserDetails($rootScope.currentUser.username, userDetails, function (response) {
                $scope.saved = true;
                $(".makeEditable").attr("disabled", "disabled");
                $("#editBtn").show();
                $("#updtUser").hide();
                $("#cancelEditBtn").hide();
            });
            $scope.updateProfileMsg = "Profile updated.";
        }
        else{
            $scope.updateProfileMsg = "Values cannot be null.";
        }
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

    $scope.updatePref = function (id,val){
        $scope.updatePrefMsg = null;
        var pref = $('#preferences').val();
        var arrayOfPref = pref.split(",");
        var index = arrayOfPref.indexOf(id);
        if(pref.indexOf(id) < 0) {
            //add element
            if(val == 'Y'){
                arrayOfPref.push(id);
            }
        }
        else{
            //remove element
            if(val == 'N'){
                arrayOfPref.splice(index, 1);
            }
        }
        pref = arrayOfPref.join();
        pref = pref.indexOf(",") == 0 ? pref.substring(1) : pref;

        $('#preferences').val(pref);
        $rootScope.preferences = pref;
        $scope.preferences = pref;
    };

    $scope.savePreferences = function(preferences){
        var preferences = $('#preferences').val();
        $rootScope.preferences = preferences;
        $scope.preferences = preferences;

        var distance = $('#distanceRadius').val();
        $rootScope.distance = distance;
        $scope.distance = distance;

        var currentUser = $rootScope.currentUser;
        var newPref = {username: currentUser.username, preferences : preferences, distance:distance};

        UserService.updateUserPreferences(currentUser._id, newPref, function (response) {
            $scope.currentUser = response;
            $scope.updatePrefMsg = "Preferences are updated.";
        })
    };

    $(document).ready(function () {
        $('#preferences').val($scope.preferences);
        var savedDistance= $scope.distance;
        if(!savedDistance)
            savedDistance=5;
        $('#distanceRadius').slider('setValue', Number(savedDistance));

        $("#updtUser").hide();
        $("#cancelEditBtn").hide();

        $("#editBtn").click(function () {
            $(".makeEditable").removeAttr("disabled");
            $("#editBtn").hide();
            $("#updtUser").show();
            $("#cancelEditBtn").show();
        });

        if($scope.preferences != null){
            //alert("set button " +  savedPreferences);
            var arrayOfPref = $scope.preferences.split(",");
            var arrayLength = arrayOfPref.length;
            for (var i = 0; i < arrayLength; i++) {
                var cat = arrayOfPref[i];
                var id = "#" + cat;
                //alert(document.getElementById(cat).id);

                $("#Food").find('.btn').toggleClass('btn-default');
                //alert("done");
                //.toggleClass('btn-default');
                //document.getElementById(cat).classList.toggle('btn-default');
                //.toggleClass('btn-default');
            }
        }

    });


});

