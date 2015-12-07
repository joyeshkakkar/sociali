describe("testing", function() {

    beforeEach(module("SocialiApp"));

    var SignupController,scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        SignupController = $controller('SignupController', {
            $scope: scope
        });
    }));
    var tempUserLogin = {username: "aa", password: "aa"};
    var tempUserDetails = {firstName: "test", lastName: "test", username: "aa", email: "test@test.com", password: "aa", phone: "1234567890"};

    it('Scope should be defined', function () {
        expect(scope).toBeDefined();
    });
    it('new user signup', function () {

        scope.userLogin = tempUserLogin;
        scope.userDetails = tempUserDetails;
        scope.signup();
        //scope.login();
        expect(scope.currentUser).toBeDefined();
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

});

