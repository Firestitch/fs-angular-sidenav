'use strict';

angular
.module('app', [
    'config',
    'ui.router',
    'ngMaterial',
    'fs-angular-sidenav',
    'fs-angular-theme'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, fsThemeProvider) {

	$locationProvider.html5Mode(true);
    fsThemeProvider.options({ primary: '546E7A', accent: '546E7A' });
    $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.when('', '/demo');
    $urlRouterProvider.when('/', '/demo');

    $stateProvider
    .state('demo', {
        url: '/demo',
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl'
    })

    .state('demo1', {
        url: '/demo1',
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl'
    })

    .state('demo2', {
        url: '/demo2',
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
