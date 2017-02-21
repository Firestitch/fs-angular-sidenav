
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
            scope: {
                selected: '=?fsSelected',
                selectedSubitem: '=?fsSelectedSubitem',
                width: '=?fsWidth',
                collapse: '=?fsCollapse'
            },
            controller: function($scope) {
            	this.$scope = $scope;

            	if ($scope.width) {
                    $scope.style = { width: $scope.width + 'px' };
                }
            },
            compile: function(element) {

            	var sideNav = angular.element(element).find('fs-sidenav-side');
            	var wrap = angular.element('<div>').addClass('fs-sidenav-side-wrap');
            	sideNav
            		.attr('ng-style','style')
            		.prepend(wrap)
            		.prepend('<a href ng-click="toggleMenu()" ng-show="collapse" class="menu-toggle"><md-icon>menu</md-icon></a>');

				angular.forEach(sideNav.contents(),function(item) {
					if(item.nodeName.toLowerCase()!='fs-sidenav-item' && !angular.element(item).hasClass('menu-toggle') && !angular.element(item).hasClass('fs-sidenav-side-wrap')) {
						wrap.append(item);
					}
				});

                return {
					pre: function($scope, element) {

						if ($scope.collapse) {
                            $scope.menu = true;
                            $scope.toggleMenu = function() {
                                if ($scope.menu) {
                                    sideNav.addClass('collapse-menu');
                                } else {
                                    sideNav.removeClass('collapse-menu');
                                }

                                $scope.menu = !$scope.menu;
                            }

                            $compile(sideNav[0])($scope);
                        }
                	}
                }
           	}
        }
    })
	.directive('fsSidenavItem', function($location, fsUtil) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-item" ng-class="{ selected: selected==name }"><a ng-href="{{href}}" ng-click="clicked()"></a><fs-sidenav-subitems></fs-sidenav-subitems></div>',
	        transclude: true,
	        replace: true,
	        scope: {
	        	href: '@fsHref',
	        	click: '@?fsClick',
	        	name: '@fsName'
	        },
	        require: '^fsSidenav',
	        link: function($scope, element, attr, controller, transclude) {

	        	if(!$scope.name) {
	        		$scope.name = fsUtil.guid();
	        	}

	        	if (!controller.$scope.selected && $scope.href && $scope.href.replace(/^\/#/, '') == $location.$$url) {
                	controller.$scope.selected = $scope.name;
                }

	        	controller.$scope.$watch('selected',function(selected) {
	        		$scope.selected = selected;
	        	});

	        	var a = angular.element(element[0].querySelector('a'));
	        	var s = angular.element(element[0].querySelector('fs-sidenav-subitems'));
	        	transclude(function(clone) {
	        		angular.forEach(clone,function(item) {
	        			if(angular.element(item).hasClass('fs-sidenav-subitem') || item.nodeName.toLowerCase()=='#comment') {
							s.append(item);
	        			} else {
	        				a.append(item);
	        			}
	        		});
	        	});

	        	$scope.clicked = function(e) {
	        		if($scope.click) {
						$scope.$parent.$eval($scope.click,{ $event: e });
					}

					if(!$scope.href) {
						controller.$scope.selected = $scope.name;
					}
	        	}
	        }
	    }
	})
	.directive('fsSidenavSubitem', function($location, fsUtil) {
    	return {
	        restrict: 'E',
	        template: '<div class="fs-sidenav-subitem" ng-class="{ selected: selectedName==name }"><a ng-href="{{href}}" ng-click="clicked(e)"><ng-transclude></ng-transclude></a></div>',
	        transclude: true,
	        replace: true,
	        scope: {
	        	href: '@fsHref',
	        	click: '@?fsClick',
	        	name: '@fsName',
	        	selected: '=?fsSelected'
	        },
	        require: '^fsSidenav',
	        link: function($scope, element, attr, controller, transclude) {

	        	if(!$scope.name) {
	        		$scope.name = fsUtil.guid();
	        	}

	        	if (!controller.$scope.selectedSubitem && $scope.href && $scope.href.replace(/^\/#/, '') == $location.$$url) {
                	controller.$scope.selectedSubitem = $scope.name;
                }

                $scope.$watch('selected',function(selected) {
                	if(selected) {
                		controller.$scope.selectedSubitem = $scope.name;
                	}
	        	});

	        	controller.$scope.$watch('selectedSubitem',function(selected) {
	        		$scope.selectedName = selected;
	        	});

	        	$scope.clicked = function(e) {
	        		if($scope.click) {
						$scope.$parent.$eval($scope.click,{ $event: e });
					}

					if(!$scope.href) {
						controller.$scope.selectedSubitem = $scope.name;
					}
	        	}
	        }
	    }
	});
})();

