'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope) {

  	$scope.click = function(event) {
  		alert('clicked');
  	}

  	$scope.selected = 'types';
  	$scope.hello = 'Hello!';
    
});
