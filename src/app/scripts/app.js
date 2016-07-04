'use strict';

angular
.module('app', [
    'config',
    'ui.router',
    'ngMaterial',
    'fs-angular-sidenav'
])
.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.when('', '/demo');
    $urlRouterProvider.when('/', '/demo');

    $stateProvider
    .state('demo', {
        url: '/demo',
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl'
    })

    .state('404', {
        templateUrl: 'views/404.html',
        controller: 'DemoCtrl'
    })

    .state('page', {
        url: '/page',
        templateUrl: 'views/page.html'
    });

})
.run(function ($rootScope, BOWER) {
    $rootScope.app_name = BOWER.name;
});
