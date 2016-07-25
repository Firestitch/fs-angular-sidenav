
(function () {
    'use strict';

    angular.module('fs-angular-sidenav',[])
    .directive('fsSidenav', function($compile, $location) {
      return {
          restrict: 'E',
          scope: {
              selected: '=fsSelected',
              width: '=fsWidth'
          },

          controller: function($scope) {

            $scope.sideClick = function($event,id,click) {
             
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
                var a = angular.element('<a>');
                var text = angular.element(el.contents()[0]);

                if(!el.attr('fs-id'))
                  el.attr('fs-id','id_' + guid());

                var id = el.attr('fs-id');                

                if(el.attr('fs-href')) {
                  a.attr('href',el.attr("fs-href"));
                }

                el.attr('ng-class','{ selected: selected==\'' + id + '\'}');

                var click = el.attr('fs-click') ? el.attr('fs-click').replace(/'/g, "\\'") : '';

                a.attr('ng-click','sideClick($event,\'' + id + '\',\'' + click + '\')');                
                a.addClass('fs-sidenav-item');
                a.append(text.clone());

                text.replaceWith(a);

                angular.forEach(item.querySelectorAll('fs-sidenav-subitem'),function(item) {

                  var item = angular.element(item);
                  var text = angular.element(item.contents()[0]);
                  item.attr('ng-class','{ selected: selected==\'' + id + '\'}');

                  var a = angular.element('<a>');
                  a.attr('href',item.attr('fs-href'));
                  a.append(text.clone());

                  text.replaceWith(a);
                });
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

                var items = element[0].querySelectorAll('fs-sidenav-side fs-sidenav-item');
                var el = angular.element(items);
                $compile(el.contents())($scope);
                
                angular.forEach(items,function(item,index) {
                  var href = angular.element(item).attr('fs-href');
                  if(!$scope.selected && href && href.replace(/^\/#/,'')==$location.$$url) {
                    $scope.selected = angular.element(item).attr('fs-id');
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



