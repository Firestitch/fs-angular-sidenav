
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
                    angular.element(element[0].querySelector('fs-sidenav-side')).css('width',$scope.width + 'px');
                }

                var items = element[0].querySelectorAll('fs-sidenav-side a');
              
                angular.forEach(items,function(item,index) {

                    var el = angular.element(item);

                    if(el.attr("fs-href")) {
                        el.attr('href',el.attr("fs-href"));
                    }

                    if(!el.attr("fs-id")) {
                        el.attr('fs-id','fs-id-' + Math.round((new Date()).getTime()/(index + 1)));
                    }

                    el.on('click',function(e) {

                        var el = angular.element(this);
                       
                        if(el.attr('fs-click')) {
                            var result = $scope.$parent.$eval(el.attr('fs-click'),{ $event: e });

                            if(result===false) {
                                return;
                            }
                        }

                        $scope.$apply(function() {
                            $scope.selected = el.attr('fs-id');
                        });
                    });
                });

                $scope.$watch('selected',function(selected) {
                    select(selected);
                });

                function select(id) {                    

                    var item = element[0].querySelector('fs-sidenav-side > a[fs-id="' + id + '"][fs-disabled]');

                    if(item) {
                        return;
                    }

                    angular.element(element[0].querySelectorAll('fs-sidenav-side a')).removeClass('fs-selected');
                    angular.element(element[0].querySelectorAll('fs-sidenav-side a[fs-id="' + id + '"]')).addClass('fs-selected');

                    angular.element(element[0].querySelectorAll('fs-sidenav-content > div[fs-id]'))
                        .removeClass('fs-selected')
                        .css('display','none');

                    var item = element[0].querySelector('fs-sidenav-content > div[fs-id="' + id + '"]');

                    if(item) {
                        angular.element(item)
                            .addClass('fs-selected')
                            .css('display','block');
                    }   
                }

                // HACK: to get the pallette's colors
                function getRGB(input) {

                  var themeProvider = fsTabnavTheme.themeColors;

                  var themeName     = 'default';
                  var hueName       = 'default';
                  var intentionName = 'primary';
                  var hueKey,theme,hue,intention;
                  var shades = {
                    '50' :'50' ,'100':'100','200':'200','300':'300','400':'400',
                    '500':'500','600':'600','700':'700','800':'800','A100':'A100',
                    'A200':'A200','A400':'A400','A700':'A700'
                  };
                  var intentions = {
                    primary:'primary',
                    accent:'accent',
                    warn:'warn',
                    background:'background'
                  };
                  var hues = {
                    'default':'default',
                    'hue-1':'hue-1',
                    'hue-2':'hue-2',
                    'hue-3':'hue-3'
                  };

                  // Do our best to parse out the attributes
                  angular.forEach(input.split(' '), function(value, key) {
                    if (0 === key && 'default' === value) {
                      themeName = value;
                    } else
                    if (intentions[value]) {
                      intentionName = value;
                    } else if (hues[value]) {
                      hueName = value;
                    } else if (shades[value]) {
                      hueKey = value;
                    }
                  });

                  // Lookup and assign the right values
                  if ((theme = themeProvider._THEMES[themeName])) {

                    if ((intention = theme.colors[intentionName]) ) {


                      if (!hueKey) {
                        hueKey = intention.hues[hueName];
                      }
                      if ((hue = themeProvider._PALETTES[intention.name][hueKey]) ) {
                        return 'rgb('+hue.value[0]+','+hue.value[1]+','+hue.value[2]+')';                      
                      }
                    }
                  }
                }                
            }
        };
    });
})();



