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

    angular.module('fs-angular-sidenav', ['fs-angular-util'])
    .directive('fsSidenav', function($compile) {
        return {
            restrict: 'E',
            template: '<div class="fs-sidenav" ng-class="{ collapsed: collapsed }" ng-transclude></div>',
            replace: true,
            transclude: true,
            scope: {
                selected: '=?fsSelected',
                selectedSubitem: '=?fsSelectedSubitem',
                width: '=?fsWidth',
                collapse: '=?fsCollapse'
            },
            controller: function($scope) {
            	this.$scope = $scope;
            	this.selected = $scope.selected;
            	this.selectedSubitem = $scope.selectedSubitem;
            	$scope.toggleMenu = function() {
            		$scope.collapsed = !$scope.collapsed;
            	}
            }
        }
    })
    .directive('fsSidenavSide', function($location, fsUtil) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-side" ng-style="style"><a href ng-click="$parent.toggleMenu()" ng-show="$parent.collapse" class="menu-toggle"><md-icon>menu</md-icon></a><div class="fs-sidenav-side-wrap" ng-transclude></div></div>',
	        transclude: true,
	        replace: true,
	        require: '^fsSidenav',
	        link: function($scope, element, attr, controller, transclude) {

            	if ($scope.$parent.width) {
                    $scope.style = { width: $scope.$parent.width + 'px' };
                }
	        }
	    }
	})
	.directive('fsSidenavItem', function($location, fsUtil, $rootScope) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-item" ng-class="{ \'has-icon\': !!icon, selected: selected==name, disabled: disabled }" ng-hide="hide">\
	        				<a ng-href="{{href}}" ng-click="clicked()">\
	        					<div layout="row" layout-align="start center">\
	    							<md-icon ng-if="icon">{{icon}}</md-icon>\
	    							<div class="fs-sidenav-item-name" flex="100" ng-transclude></div>\
	    						</div>\
	        				</a>\
	        				<fs-sidenav-subitems ng-show="selected==name" ng-transclude="subitems"></fs-sidenav-subitems>\
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
	        		$scope.selected = selected;
	        	});

	        	$scope.clicked = function(e) {
	        		if($scope.click) {
						$scope.$parent.$eval($scope.click,{ $event: e });
					}

					if(!$scope.href) {
						select();
					}
	        	}

	        	function selectedUrl() {
	        		if ($scope.href == $location.$$url) {
                		select();
                	}
                }

                function select() {
	        		controller.$scope.selected = $scope.name;
	        		controller.$scope.selectedSubitem = '';
	        	}
	        }
	    }
	})
	.directive('fsSidenavSection', function(fsTheme) {
    	return {
	        restrict: 'E',
	        link: function($scope, element, attr, controller) {
	        	angular.element(element).css('backgroundColor',fsTheme.primaryHex());
	        }
	    }
	})
	.directive('fsSidenavSubitem', function($location, fsUtil, $rootScope) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-subitem" ng-class="{ selected: selected==name }"><a ng-href="{{href}}" ng-click="clicked(e)" ng-transclude></a></div>',
	        transclude: true,
	        replace: true,
	        scope: {
	        	href: '@fsHref',
	        	click: '@?fsClick',
	        	name: '@fsName',
	        	selected: '=?fsSelected'
	        },
	        require: ['^fsSidenav','^fsSidenavItem'],
	        controller: function($scope) {
	        	if(!$scope.name) {
	        		$scope.name = fsUtil.guid();
	        	}
	        },
	        link: function($scope, element, attr, controller) {

				$scope.$on('$stateChangeSuccess',selectedUrl);

	        	controller[0].$scope.$watch('selectedSubitem',function(selected) {
	        		$scope.selected = selected

	        		if(selected==$scope.name) {
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

					if(!$scope.href) {
						select();
					}
	        	}

	        	function selectedUrl() {
					if($scope.href==$location.$$url) {
	                	select();
	                }
	        	}

	        	function select() {
	        		controller[0].$scope.selected = controller[1].name;
	        		controller[0].$scope.selectedSubitem = $scope.name;
	        	}
	        }
	    }
	});
})();