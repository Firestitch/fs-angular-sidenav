
(function () {
    'use strict';

    angular.module('fs-angular-sidenav',[])
    .directive('fsSidenav', function() {
        return {
            restrict: 'E',
            scope: {
                selected: '=fsSelected',
                width: '=fsWidth'
            },
            link: function($scope, element, attrs) {

                if($scope.width) {
                    angular.element(element).css('width',$scope.width + 'px');
                }

                var items = element[0].querySelectorAll('fs-sidenav-side fs-sidenav-item');

                angular.forEach(items,function(item) {
                    angular.element(item).on('click',function() {

                        angular.element(element[0].querySelectorAll('fs-sidenav-content fs-sidenav-item')).css('display','none');

                        var item = element[0].querySelector('fs-sidenav-content fs-sidenav-item[fs-id="' + angular.element(this).attr('fs-id') + '"]');

                        if(item) {
                            angular.element(item).css('display','block');
                        }                        
                    });
                });

                if($scope.selected) {
                    var item = element[0].querySelector('fs-sidenav-side fs-sidenav-item[fs-id="' + $scope.selected + '"]');
                    angular.element(item).triggerHandler('click');
                }
            }
        };
    });  

})();

