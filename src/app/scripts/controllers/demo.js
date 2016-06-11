'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope) {

  	$scope.date1 = new Date();
  	$scope.date1.setDate($scope.date1.getDate()-5);

  	$scope.date2 = new Date();
  	$scope.date2.setMinutes($scope.date2.getMinutes()-30);

  	$scope.date3 = new Date();
  	$scope.date3.setMinutes($scope.date3.getMinutes()-1);

  	$scope.date4 = new Date();
    
});
