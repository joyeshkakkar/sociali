describe("testing", function() {

    beforeEach(module("SocialiApp"));

    var LogoutController,scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        LogoutController = $controller('LogoutController', {
            $scope: scope
        });
    }));

    /*it('currentUser should be null after logout', function () {
        expect(scope.currentUser).toBeNull();
    });*/
});

