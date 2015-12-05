describe("testing", function() {

    beforeEach(module("SocialiApp"));

    var SignupController,scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        SignupController = $controller('SignupController', {
            $scope: scope
        });
    }));
    var tempUserLogin = {username: "test", password: "test"};
    var tempUserDetails = {firstName: "test", lastName: "test", username: "test", email: "test@test.com", password: "test", phone: "1234567890"};

    it('Scope should be defined', function () {
        expect(scope).toBeDefined();
    });
    it('Valid login credentials', function () {

        scope.userLogin = tempUserLogin;
        scope.signup();
        scope.login();
        expect(scope.currentUser).toBeDefined();
    });
    it('Invalid login credentials', function () {
        var tempUserLogin = {username: "test", password: "t"};
        scope.userLogin = tempUserLogin;
        scope.login();
        expect(scope.currentUser).toBeNull();
    });
    /!*it('Valid login credentials and user details are fetched', function () {
     var tempUserLogin = {username: "test", password: "test"};
     scope.userLogin = tempUserLogin;
     scope.login();
     expect(scope.userDetails).toBeDefined();
     });*!/
    it('Invalid login credentials and user details are not fetched', function () {
        var tempUserLogin = {username: "test", password: "t"};
        scope.userLogin = tempUserLogin;
        scope.login();
        expect(scope.userDetails).toBeUndefined();
    });
    it('Invalid should be false', function () {
        expect(scope.invalid).toEqual(false);
    });
    it('currentUser should be null', function () {
        expect(scope.currentUser).toBeNull();
    });
    it('invalid should be false on change method', function () {
        scope.change();
        expect(scope.invalid).toEqual(false);
    });
*/

});

