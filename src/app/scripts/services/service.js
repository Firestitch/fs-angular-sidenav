(function () {
    'use strict';

    angular.module('fs-angular-sidenav')
    .factory('fsSidenav', function($mdSidenav) {
        var service = {
            open: open
        };

        return service;

        function open() {
            $mdSidenav('fs-sidenav').toggle();
        }

    });
})();
