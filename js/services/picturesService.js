'use strict';

app.factory('picturesService', ['$http', '$q', 'Picture', 'CONSTANTS', function($http, $q, Picture, CONSTANTS) {
    var service = {
        _pool: {},

        _retrieveInstance: function(pictureId, data) {
            var instance = this._pool[pictureId];

            if (instance) {
                instance.setData(data);
            } else {
                instance = new Picture(data);
                this._pool[pictureId] = instance;
            }

            return instance;
        },

        _search: function(pictureId) {
            return this._pool[pictureId];
        },

        _load: function(pictureId, deferred) {
            var scope = this;

            $http.get(CONSTANTS.URL + '/pictures/' + pictureId)
                .success(function(data) {
                    var picture = scope._retrieveInstance(data.id, data);
                    deferred.resolve(picture);
                })
                .error(function() {
                    deferred.reject();
                });
        },

        getPicture: function(pictureId) {
            var deferred = $q.defer();
            var picture = this._search(pictureId);
            if (picture) {
                deferred.resolve(picture);
            } else {
                this._load(pictureId, deferred);
            }
            return deferred.promise;
        },

        /* Get instances of all the pictures */
        loadAllPictures: function() {
            var deferred = $q.defer();
            var scope = this;

            $http.get(CONSTANTS.URL + '/pictures')
                .success(function(picturesArray) {
                    console.log("picturesArray = ", picturesArray);
                    var pictures = [];
                    picturesArray.forEach(function(data) {
                        var picture = scope._retrieveInstance(data.id, data);
                        pictures.push(picture);
                    });

                    deferred.resolve(pictures);
                })
                .error(function() {
                    deferred.reject();
                });

            return deferred.promise;
        },

        /*  This function is useful when we got somehow the picture data and we wish to store it or update the pool and get a picture instance in return */
        setPicture: function(data) {
            var scope = this;
            var picture = this._search(data.id);

            if (picture) {
                picture.setData(data);
            } else {
                picture = scope._retrieveInstance(data.id, data);
            }

            return picture;
        },

        getPreloadedPictures: function() {
            var pictures = [
                {
                    filename: "pictureEx1.jpeg",
                    type: "image/jpeg",
                    filesize: 397213,
                    path: "http://localhost:8080/8d5f437648a55e9e30e4d5b82d0ef313.jpeg"
                },
                {
                    name: "pictureEx2.jpg",
                    type: "image/jpeg",
                    size: 43696,
                    path: "http://localhost:8080/d4ebfaab636e5adeeca53443620ccdd1.jpg"
                },
                {
                    filename: "pictureEx3.jpg",
                    type: "image/jpeg",
                    filesize: 216636,
                    path: "http://localhost:8080/d36d2bc5f69d36714b4288dddc425407.jpg"
                },
                {
                    filename: "pictureEx4.jpg",
                    type: "image/jpeg",
                    filesize: 63861,
                    path: "http://localhost:8080/ae7202adcde58db27fda3ebb234fc567.jpg"
                },
                {
                    filename: "pictureEx5.jpg",
                    type: "image/jpeg",
                    filesize: 55386,
                    path: "http://localhost:8080/ad5553e1dfc288aa95f66bbc32c1b8c2.jpg"
                }
            ];
            return pictures;
        }
    };

    return service;
}]);