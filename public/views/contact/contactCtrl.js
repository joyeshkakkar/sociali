app.controller("ContactController", function ($scope, $http, $rootScope) {
    var currentUser = $rootScope.currentUser;
    var userDetails = $rootScope.userDetails;
    if (currentUser != null && userDetails !=null ) {
        var sender = { name: userDetails.firstName + " " + userDetails.lastName, email: userDetails.email, username: userDetails.username };
        $scope.sender = sender;
    }



    $scope.mailMe = function (sender) {
        console.log(sender);
        $http.post("/api/sendMail", sender)
         .success(function (response) {
             console.log("mail sent");
             $scope.showMailSentMsg = "Your message is sent. Thanks!";
             $scope.sender = null;
         })
         .error(function (response) {
             console.log("mail not sent");
         });
    }

    $scope.reset = function(){
        document.getElementById("email").value = '';
        $scope.sender={};
    }

    $scope.change = function(){
        $scope.showMailSentMsg = null;
    }
});