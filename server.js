/**
 * PictureRepository class deals with picture persistence
 */
function PictureRepository() {
    this.pictures = [];
    this.nextId = 1;
}
/**
 * Find a picture by id
 * Param: id of the picture to find
 * Returns: the picture corresponding to the specified id
 */
PictureRepository.prototype.find = function (id) {
    var picture = this.pictures.filter(function(item) {
        return item.pictureId == id;
    })[0];

    if (null === picture) {
        throw new Error('picture not found');
    }

    return picture;
};
/**
 * Find the index of a picture
 * Param: id of the picture to find
 * Returns: the index of the picture identified by id
 */
PictureRepository.prototype.findIndex = function (id) {
    var index = null;
    this.pictures.forEach(function(item, key) {
        if (item.pictureId == id) {
            index = key;
        }
    });

    if (null == index) {
        throw new Error('picture not found');
    }

    return index;
};
/**
 * Retrieve all pictures
 * Returns: array of pictures
 */
PictureRepository.prototype.findAll = function () {
    return this.pictures;
};
/**
 * Save a picture (create or update)
 * Param: picture the picture to save
 */
PictureRepository.prototype.save = function (picture) {
    if (picture.pictureId == null || picture.pictureId == 0) {
        picture.pictureId = this.nextId;
        this.pictures.push(picture);
        this.nextId++;
    }
    else {
        var index = this.findIndex(picture.pictureId);
        this.pictures[index] = picture;
    }

};
/**
 * Remove a picture
 * Param: id the of the picture to remove
 */
PictureRepository.prototype.remove = function (id) {
    var index = this.findIndex(id);
    this.pictures.splice(index, 1);
};
/**
 * API
 */
var express = require('express');
var app = express();
var multer = require('multer');
var bodyParser = require('body-parser');
var PictureRepository = new PictureRepository();
var uploadPath = '/uploads';
var morgan = require('morgan');

/**
 * APP configuration
 */
app.use(express.static(__dirname + uploadPath));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));

/**
 * HTTP POST /pictures/upload
 * Body Param: the JSON picture you want to upload to the server
 * Return: picture name on the server
 */
app.post('/pictures/upload',
    [ multer({ dest: '.' + uploadPath + '/'}),
        function(req, res){
            console.log('req.files=', JSON.stringify(req.files));// form files
            var responseData = {};
            responseData.name = req.files.file.name;
            res.send(responseData);
            res.end();
        }
    ]
);

/**
 * HTTP GET /pictures
 * Returns: the list of pictures in JSON format
 */
app.get('/pictures', function (request, response) {
    response.json({pictures: PictureRepository.findAll()});
});

/**
 * HTTP GET /pictures/:id
 * Param: :id is the unique identifier of the picture you want to retrieve
 * Returns: the picture with the specified :id in a JSON format
 * Error: 404 HTTP code if the picture doesn't exists
 */
app.get('/pictures/:id', function (request, response) {
    var pictureId = request.params.id;

    try {
        response.json(PictureRepository.find(pictureId));
    }
    catch (exeception) {
        response.send(404);
    }

});

/**
 * HTTP POST /pictures/
 * Body Param: the JSON picture you want to create
 * Returns: 200 HTTP code
 */
app.post('/pictures', function (request, response) {
    console.log("------post------\n\n/pictures");
    var picture = request.body;
    console.log("req.files=",JSON.stringify(request.files));
    console.log("req.body=",JSON.stringify(request.body));
    PictureRepository.save({
        title: picture.title || 'Default title',
        type: picture.type || 'Default usage',
        name: picture.name || "Default filename",
        size: picture.size || 1,
        url: picture.url || 'defaulturl'
    });

    response.send(200);
});

/**
 * HTTP PUT /pictures/
 * Param: :id the unique identifier of the picture you want to update
 * Body Param: the JSON picture you want to update
 * Returns: 200 HTTP code
 * Error: 404 HTTP code if the picture doesn't exists
 */
app.put('/pictures/:id', function (request, response) {
    console.log("-------put-------\n\n/pictures/id");
    console.log("req.files=",JSON.stringify(request.files));
    console.log("req.body=",JSON.stringify(request.body));
    var picture = request.body;
    var pictureId = request.params.id;

    try {
        var persistedpicture = PictureRepository.find(pictureId);

        PictureRepository.save({
            pictureId: persistedpicture.pictureId,
            type: picture.type || persistedpicture.type,
            name: picture.name || persistedpicture.name,
            size: picture.size || persistedpicture.size,
            url: picture.url || persistedpicture.url
        });
        response.send(200);
    }
    catch (exception) {
        response.send(404);
    }
});

/**
 * HTTP PUT /pictures/
 * Param: :id the unique identifier of the picture you want to update
 * Body Param: the JSON picture you want to update
 * Returns: 200 HTTP code
 * Error: 404 HTTP code if the picture doesn't exists
 */
app.delete('/pictures/:id', function (request, response) {
    try {
        PictureRepository.remove(request.params.id);
        response.send(200);
    }
    catch (exeception) {
        response.send(404);
    }
});

app.listen(8080); //to port on which the express server listen
console.log("App listening on port 8080");