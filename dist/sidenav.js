
(function () {
    'use strict';

    angular.module('fs-angular-sidenav',[])
    .directive('fsSidenav', function($compile) {
      return {
          restrict: 'E',
          scope: {
              selected: '=fsSelected',
              width: '=fsWidth'
          },

          controller: function($scope) {

            $scope.sideClick = function($event,id,click) {
              debugger;
              if(click) {
                var result = $scope.$parent.$eval(click,{ $event: $event });

                if(result===false) {
                    return;
                }
              }

              $scope.select(id);
            }

            $scope.select = function(id) {

              angular.element($scope.element[0].querySelectorAll('fs-sidenav-content fs-sidenav-item'))
              .removeClass('selected');

              angular.element($scope.element[0].querySelector('fs-sidenav-content fs-sidenav-item[fs-id=\'' + id + '\']'))
              .addClass('selected');

              $scope.selected = id;
            }
          },

          compile: function(element) {

            var items = element[0].querySelectorAll('fs-sidenav-side fs-sidenav-item');
          
            angular.forEach(items,function(item,index) {

                var el = angular.element(item);
                var id = el.attr('fs-id') ? el.attr('fs-id') : 'id_' + guid();
                var a = angular.element('<a>').attr('fs-id',id);

                if(el.attr('fs-href')) {
                  a.attr('href',el.attr("fs-href"));
                } else {

                  var click = el.attr('fs-click') ? el.attr('fs-click').replace(/'/g, "\\'") : '';

                  a.attr('ng-click','sideClick($event,\'' + id + '\',\'' + click + '\')')
                  .attr('ng-class','{ selected: selected==\'' + id + '\'}');
                }

                el.replaceWith(a.append(el.html()));
            });

            function guid() {
                return 'xxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }

            return { 

              pre: function($scope, element, attrs) {

                $scope.element = element;

                if($scope.width) {
                    angular.element(element[0].querySelector('fs-sidenav-side')).css('width',$scope.width + 'px');
                }

                var items = element[0].querySelectorAll('fs-sidenav-side');
          
                angular.forEach(items,function(item,index) {

                  var el = angular.element(item);
                
                  if(!el.attr('fs-href')) {
                    $compile(el.contents())($scope);
                  }
                });

                if($scope.selected) {
                  $scope.select($scope.selected);
                }
              }
            }
          }
        }
    });
})();



