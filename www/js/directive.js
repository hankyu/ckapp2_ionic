angular.module('starter')

//to call the lectureAppCtrl let popover close
.directive('tapToClosePopover', [function (){
  return {
    restrict: 'A',
    link: function (scope, elem, attrs){
      elem.on('click', function (){
        if (elem[0].className.indexOf('popover-open')>-1) {
          scope.$broadcast('backdropClick');
        }
      });
    }
  };
}])

.directive('tapTheLink', ['$timeout', function ($timeout){
  return {
    restrict: 'A',
    link: function (scope, elem, attrs){
      $timeout(function (){
        console.log(angular.element(elem).find('a'));
        var allSelector = angular.element(elem).find('a');
        for (var i = 0; i < allSelector.length; i++) {

          var myhref = angular.element(allSelector[i])[0].href ;
          angular.element(allSelector[i])[0].href = '#';
          angular.element(allSelector[i]).attr('onclick', 'window.open("' + myhref + '", "_blank", "EnableViewPortScale=yes", "location=yes"); return false;');
        }
      }, 100);
    }
  };
}]);
