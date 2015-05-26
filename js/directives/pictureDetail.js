'use strict';
angular.module('picturesPlatformApp')
    .directive('customerInfo', function() {
        return {
            restrict: 'E',
            scope: {
                customerData:'=info'
            },
            templateUrl: 'templates/customerInfoTemplate.html'
        }
});