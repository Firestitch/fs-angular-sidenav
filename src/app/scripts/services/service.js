(function () {
    'use strict';

    angular.module('fs-angular-sidenav')
    .factory('fsSidenav', function($mdSidenav) {
        var service = {
            toggle: toggle,
            open: open,
            close: close
        };

        return service;

        function open() {
            $mdSidenav('fs-sidenav').open();
        }

        function close() {
            $mdSidenav('fs-sidenav').close();
        }

        function toggle() {
            $mdSidenav('fs-sidenav').toggle();
        }

    });
})();
