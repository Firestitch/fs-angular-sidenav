(function () {
    'use strict';

    angular.module('fs-angular-sidenav')
    .factory('fsSidenav', function($mdSidenav) {
        var service = {
            toggle: toggle
        };

        return service;

        function toggle() {
            $mdSidenav('fs-sidenav').toggle();
        }

    });
})();
