'use strict';
angular.module('picturesPlatformApp')
    .directive('pictureDetails', function() {
        return {
            restrict: 'E',
            scope: {
                customerData:'=picture'
            },
            templateUrl: '<div></div>'
        }
});