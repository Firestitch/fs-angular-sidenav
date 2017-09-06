



(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name fs.directives:fs-sidenav
     * @restrict E
     * @param {string} fsSelected Indicates which item is selected by matching to the item's fs-name
     * @param {string} fsWidth The width of the side menu
     * @param {string} fsCollapse Enables the menu collapse icon and functionality
     */

    angular.module('fs-angular-sidenav', ['fs-angular-util','fs-angular-theme'])
    .directive('fsSidenav', function($mdMedia, fsUtil) {
        return {
            restrict: 'E',
            template: '<div class="fs-sidenav" ng-class="{ \'locked-open\': locked.open, collapsed: collapsed }" layout="row" ng-transclude></div>',
            replace: true,
            transclude: true,
            scope: {
                selected: '=?fsSelected',
                selectedSubitem: '=?fsSelectedSubitem',
                width: '=?fsWidth',
                collapse: '=?fsCollapse',
                lockedOpen: '=?fsLockedOpen',
                id: '@fsId'
            },
            controller: function($scope) {

            	this.$scope = $scope;
            	this.selected = $scope.selected;
            	this.selectedSubitem = $scope.selectedSubitem;

            	$scope.locked = {};
            	$scope.toggleMenu = function() {
            		$scope.collapsed = !$scope.collapsed;
            	}

            	$scope.$watch('lockedOpen',function(value) {
            		if($scope.watcher) {
	            		$scope.watcher();
	            	}

            		if($scope.lockedOpen===undefined || fsUtil.isString(value)) {
	            		var query = $scope.lockedOpen || 'gt-sm';
	            		$scope.watcher = $scope.$watch(function() {
		            		return $mdMedia(query);
		            	}, function(value) {
					    	$scope.locked.open = value;
					  	});
					} else {
						$scope.locked.open = value;
		           	}
            	});
            }
        }
    })
    .directive('fsSidenavSide', function($location, fsUtil) {
    	return {
	        restrict: 'E',
	        template: function(element) {

	        	//HACK md-sidenav doesnt allow expression for id
	        	var id = angular.element(element).parent().attr('fs-id') || 'fs-sidenav';

	        	return ' <md-sidenav md-component-id="' + id + '" md-is-locked-open="ctrl.locked.open" class="md-sidenav-left" ng-style="style">\
	        			   <div class="fs-sidenav-side-wrap" ng-transclude></div>\
	        			</md-sidenav>'
	        		},
	        transclude: true,
	        replace: true,
	        require: '^fsSidenav',
	        link: function($scope, element, attr, controller, transclude) {

	        	$scope.ctrl = controller.$scope;
            	if (controller.$scope.width) {
                    $scope.style = { width: controller.$scope.width + 'px' };
                }
	        }
	    }
	})
	.directive('fsSidenavItem', function($location, fsUtil, $rootScope, fsSidenav) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-item" ng-class="{ \'has-icon\': !!icon, selected: selected, disabled: disabled }" ng-hide="hide">\
	        				<a ng-href="{{href}}" ng-click="clicked()">\
	        					<div layout="row" layout-align="start center">\
	    							<md-icon ng-if="icon">{{icon}}</md-icon>\
	    							<div class="fs-sidenav-item-name" flex="100" ng-transclude></div>\
	    						</div>\
	        				</a>\
	        				<fs-sidenav-subitems ng-show="selected" ng-transclude="subitems"></fs-sidenav-subitems>\
	        			</div>',
	        transclude: {
	        	subitems: '?fsSidenavSubitem'
	        },
	        replace: true,
	        scope: {
	        	href: '@fsHref',
	        	click: '@?fsClick',
	        	name: '@fsName',
	        	icon: '@fsIcon',
	        	selectable: '@fsSelectable',
	        	selected: '=?fsSelected',
	        	disabled: '=?fsDisabled',
	        	hide: '=?fsHide'
	        },
	        require: '^fsSidenav',
	        controller: function($scope) {
	        	if(!$scope.name) {
	        		$scope.name = fsUtil.guid();
	        	}

	        	this.name = $scope.name;
	       	},
	        link: function($scope, element, attr, controller, transclude) {

	        	selectedUrl();

	        	if($scope.selected) {
	        		select();
	        	}

				$scope.$on('$stateChangeSuccess',selectedUrl);

	        	controller.$scope.$watch('selected',function(selected) {
	        		$scope.selected = selected==$scope.name;
	        	});

	        	$scope.clicked = function(e) {



	        		if($scope.click) {
						$scope.$parent.$eval($scope.click,{ $event: e });
					}

					if($scope.href) {
						fsSidenav.close();
					} else {
						select();
					}
	        	}

	        	function selectedUrl() {

	        		if ($scope.href == $location.$$url.replace(/\?.*/,'')) {
                		select();

                	} else if($scope.selectable) {
                		angular.forEach($scope.selectable.split(','),function(regex) {
                			if((new RegExp(regex)).exec($location.$$url)) {
								select();
                			}
                		});
                	}
                }

                function select() {
                	$scope.selected = true;
	        		controller.$scope.selected = $scope.name;
	        		controller.$scope.selectedSubitem = '';
	        	}
	        }
	    }
	})
	.directive('fsSidenavSubitem', function($location, fsUtil, $rootScope, fsSidenav, fsTheme) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-subitem" ng-class="{ selected: selected }"><a ng-href="{{href}}" ng-click="clicked(e)" ng-style="selected && { color: color }" ng-transclude></a></div>',
	        transclude: true,
	        replace: true,
	        scope: {
	        	href: '@fsHref',
	        	click: '@?fsClick',
	        	name: '@fsName',
	        	selected: '=?fsSelected',
	        	selectable: '@fsSelectable'
	        },
	        require: ['^fsSidenav','^fsSidenavItem'],
	        controller: function($scope) {

	        	$scope.color = fsTheme.primaryHex();

	        	if(!$scope.name) {
	        		$scope.name = fsUtil.guid();
	        	}
	        },
	        link: function($scope, element, attr, controller) {

				$scope.$on('$stateChangeSuccess',selectedUrl);

	        	controller[0].$scope.$watch('selectedSubitem',function(selected) {
	        		$scope.selected = selected==$scope.name;

	        		if($scope.selected) {
	        			controller[0].$scope.selected = controller[1].name;
	        		}
	        	});

	        	selectedUrl();

	        	if($scope.selected) {
	        		select();
	        	}

	        	$scope.clicked = function(e) {

	        		if($scope.click) {
						$scope.$parent.$eval($scope.click,{ $event: e });
					}

					if($scope.href) {
	        			fsSidenav.close();
	        		} else {
						select();
					}
	        	}

	        	function selectedUrl() {
					if($scope.href==$location.$$url.replace(/\?.*/,'')) {
	                	select();
	                } else if($scope.selectable) {
                		angular.forEach($scope.selectable.split(','),function(regex) {
                			if((new RegExp(regex)).exec($location.$$url)) {
								select();
                			}
                		});
                	}
	        	}

	        	function select() {
	        		$scope.selected = true;
	        		controller[0].$scope.selected = controller[1].name;
	        		controller[0].$scope.selectedSubitem = $scope.name;
	        	}
	        }
	    }
	});
})();
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

