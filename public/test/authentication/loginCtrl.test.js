describe("testing", function() {

    beforeEach(module("SocialiApp"));

    var LoginController,scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        LoginController = $controller('LoginController', {
            $scope: scope
        });
    }));
        it('defined scope', function () {
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
});

