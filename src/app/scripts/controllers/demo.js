'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope) {

  	$scope.click = function(event) {
  		debugger;
  	}

  	$scope.selected = 'types';
  	$scope.subselected = 'sub2';
  	$scope.hello = 'Hello!';

});
