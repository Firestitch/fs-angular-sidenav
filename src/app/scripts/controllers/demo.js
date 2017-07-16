'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, $timeout, fsSidenav) {

  	$scope.open = function() {
		fsSidenav.open();
  	}

  	$scope.variable = 'xxxxxxxxxx';

  	//$scope.selected = 'types';
  	//$scope.subselected = 'Sub2';
  	$scope.hello = 'Hello!';

  	$scope.subs = [{ name: 'Sub1' },{ name: 'Sub2' },{ name: 'Sub3' },{ name: 'Sub4' }];


  	$timeout(function() {
  		$scope.subs = [{ name: 'Sub1' },{ name: 'Sub2' }];
  	}, 2000);

});
