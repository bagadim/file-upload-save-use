app.factory('Picture', ['$http','CONSTANTS', function($http, CONSTANTS) {
    /**
    *
    */
    function Picture(data) {
        if (data) {
            this.setData(data);
        }
        console.log("Start saving picture. frontend");
        $http.put(CONSTANTS.URL_PICTURES_API + '/' + 7, {title:"title",usageType:"Type"});
        $http({
            method: 'POST',
            url: CONSTANTS.URL_PICTURES_API,
            data: {"title":"title","usageType":"Type"}
        }).success(function(data, status, headers, config){
            console.log("Picture was saved.")
            console.log("data = ", data, "status = ", status, "config.file = ", config.file);
        }).error(function(err){
            console.log("Picture was NOT saved.")
            console.log("err = ",err);
        });
        //$http.post(CONSTANTS.URL_PICTURES_API, this)
        //    .success(function(data, status, headers, config){
        //        console.log("Picture was saved.")
        //        console.log("data = ", data, "status = ", status, "config.file = ", config.file);
        //        }
        //    );
    };
    Picture.prototype = {
        setData: function(data) {
            angular.extend(this, data);
        },
        delete: function() {
            $http.delete(CONSTANTS.URL_PICTURES_API + '/' + this.id);
        },
        update: function() {
            $http.put(CONSTANTS.URL_PICTURES_API + '/' + this.id, this);
        },
        getUrl: function() {
            return this.url;
        }
    };
    return Picture;
}]);