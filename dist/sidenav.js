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
        .directive('fsSidenav', function($compile, $location, fsUtil, $interpolate) {
            return {
                restrict: 'E',
                scope: {
                    selected: '=?fsSelected',
                    width: '=fsWidth',
                    collapse: '=fsCollapse'
                },
                controller: function($scope) {
                    $scope.init = true;
                    $scope.show = {};
                    $scope.sideClick = function($event, id, click, href) {

                        if (click) {
                            var result = $scope.$parent.$eval(click, { $event: $event });

                            if (result === false) {
                                return;
                            }
                        }

                        $scope.select(id);
                    }

                    $scope.select = function(id) {

                        angular.element($scope.element[0].querySelectorAll('fs-sidenav-content fs-sidenav-item'))
                            .removeClass('selected');

                        angular.element($scope.element[0].querySelector('fs-sidenav-content fs-sidenav-item[fs-name=\'' + id + '\']'))
                            .addClass('selected');

                        $scope.selected = id;
                    }
                },

                compile: function(element) {

                    var items = element[0].querySelectorAll('fs-sidenav-side fs-sidenav-item');

                    var sideNav = angular.element(element[0].querySelector('fs-sidenav-side'));

                    var wrap = angular.element('<div class="fs-sidenav-side-wrap"></div>').append(sideNav.children());

                    sideNav.append(wrap);

                    sideNav.prepend('<a href ng-click="toggleMenu()" ng-show="collapse" class="menu-toggle"><md-icon>menu</md-icon></a>');

                    angular.forEach(items, function(item, index) {

                        var sub_items = item.querySelectorAll('fs-sidenav-subitem');

                        angular.element(sub_items).remove();

                        var el = angular.element(item);
                        var a = angular.element('<a>');

                        if (el.attr('fs-id')) {
                            el.attr('fs-name', el.attr('fs-id'));
                        }

                        if (!el.attr('fs-name')) {
                            el.attr('fs-name', 'item_' + fsUtil.guid());
                        }

                        var id = el.attr('fs-name');

                        if (el.attr('fs-href')) {
                            a.attr('href', el.attr("fs-href"));
                        }

                        el.attr('ng-class', '{ selected: selected==\'' + id + '\' && init, show: show[' + index + ']}');

                        var click = el.attr('fs-click') ? el.attr('fs-click').replace(/'/g, "\\'") : '';
                        var href = !!el.attr('fs-href');

                        a.attr('ng-click', 'sideClick($event,\'' + id + '\',\'' + click + '\',' + href + ')');
                        a.addClass('fs-sidenav-item');
                        a.append(angular.element(el.contents()).clone());

                        angular.forEach(sub_items, function(item) {

                            var item = angular.element(item);
                            var text = angular.element(item.contents()[0]);

                            var a = angular.element('<a>');
                            a.attr('href', item.attr('fs-href'));
                            a.append(text.clone());

                            text.replaceWith(a);
                        });

                        el.empty().append(a).append(sub_items);

                        el.replaceWith(angular.element('<div>')
                            .addClass('fs-sidenav-wrap')
                            .append(el.clone()));
                    });

                    angular.forEach(element[0].querySelectorAll('fs-sidenav-item'), function(item) {
                        var item = angular.element(item);
                        if (item.attr('fs-id'))
                            item.attr('fs-name', item.attr('fs-id'));
                    });

                    return {

                        pre: function($scope, element, attrs) {

                            $scope.account = $scope.$parent.account;
                            $scope.element = element;

                            var sideNav = angular.element(element[0].querySelector('fs-sidenav-side'));

                            if ($scope.width) {
                                sideNav.css('width', $scope.width + 'px');
                            }

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

                                $compile(sideNav[0].querySelector('.menu-toggle'))($scope);
                            }

                            var items = element[0].querySelectorAll('fs-sidenav-side fs-sidenav-item');

                            angular.forEach(items, function(item, index) {
                                $scope.show[index] = true;
                                var el = angular.element(item);
                                var href = '';

                                if (el.attr('fs-href')) {
                                    href = $interpolate(el.attr('fs-href'))($scope.$parent);
                                    el.attr('fs-href', href);
                                }

                                if (!$scope.selected && href && href.replace(/^\/#/, '') == $location.$$url) {
                                    $scope.selected = el.attr('fs-name');
                                }

                                if (el.attr('fs-show')) {
                                    $scope.$parent.$watch(el.attr('fs-show'), function(value) {
                                        $scope.show[index] = value;
                                    });
                                }
                            });

                            if (!$scope.selected) {
                                $scope.selected = angular.element(element[0].querySelector('fs-sidenav-side fs-sidenav-item[fs-name]')).attr('fs-name');
                            }

                            var items = element[0].querySelectorAll('fs-sidenav-side .fs-sidenav-wrap');
                            angular.forEach(items, function(item) {
                                var el = angular.element(item);
                                $compile(el.contents())($scope);
                            });

                            if ($scope.selected) {
                                $scope.select($scope.selected);
                            }
                        }
                    }
                }
            }
        });
})();
