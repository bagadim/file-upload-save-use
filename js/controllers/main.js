'use strict';
var app = angular.module('picturesPlatformApp', ['ngFileUpload']);

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

app.constant('CONSTANTS', {
    'URL': 'http://localhost:8080',
    'URL_PICTURES_API': 'http://localhost:8080/pictures',
    'URL_PICTURES_API_UPLOAD': 'http://localhost:8080/pictures/upload'
})

app.controller('MainCtrl', ['$scope', 'Upload', 'CONSTANTS', 'picturesService', function ($scope, Upload, CONSTANTS, picturesService) {

    $scope.pictures = picturesService.getPreloadedPictures();
    $scope.uploadingFileStatus = {};

    $scope.upload = function (files) {
        if (files && files.length) {
            Upload.upload({
                url: CONSTANTS.URL_PICTURES_API_UPLOAD,
                file: files[0],
                method: 'POST'
            }).success (function (data, status, headers, config) {
                console.log("picture was uploaded.");
                $scope.uploadingFileStatus.message = 'Picture was uploaded';
                console.log("data = ", data, "config = ", config.file);
                var tmpData = {
                    name : config.file.name,
                    type : config.file.type,
                    size : config.file.size,
                    url : CONSTANTS.URL + '/' + data.name
                };
                $scope.uploadingFileStatus.data = tmpData;
                console.log(tmpData);
                picturesService.setPicture(tmpData);
                console.log("picture was set.");
            }).error (function (data){
                $scope.uploadingFileStatus.message = 'Picture was NOT uploaded';
                $scope.uploadingFileStatus.error = data;
            });
        }
    };

}]);