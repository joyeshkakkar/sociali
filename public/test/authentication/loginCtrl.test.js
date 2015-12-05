describe("testing", function() {

    beforeEach(module("SocialiApp"));

    var LoginController,scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        LoginController = $controller('LoginController', {
            $scope: scope
        });
    }));
        it('Scope should be defined', function () {
            expect(scope).toBeDefined();
        });
        it('Valid login credentials', function () {
            var tempUserLogin = {username: "test", password: "test"};
            scope.userLogin = tempUserLogin;
            scope.login();
            expect(scope.currentUser).toBeDefined();
        });
        it('Invalid login credentials', function () {
            var tempUserLogin = {username: "test", password: "t"};
            scope.userLogin = tempUserLogin;
            scope.login();
            expect(scope.currentUser).toBeNull();
        });
        /*it('Valid login credentials and user details are fetched', function () {
            var tempUserLogin = {username: "test", password: "test"};
            scope.userLogin = tempUserLogin;
            scope.login();
            expect(scope.userDetails).toBeDefined();
        });*/
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


});

