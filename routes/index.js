var express = require('express');
var router = express.Router();

var fs = require('fs');
var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/getindex', function(req, res, next) {

  var bookPath = config.get('bookPath');
  var index = [];

  console.log('bookPath : ' + bookPath);


  var files = fs.readdirSync(bookPath);

  files.forEach(function(file) {
        var path = bookPath + "/" + file;
        var element = fs.statSync(path);
        console.log(element);
        if (element.isDirectory()) {
            var subs = [];
            var chapter_files = fs.readdirSync(path);

            chapter_files.forEach(function(file) {
              var order = file.split(".")[0];
              var title = file.split(".")[1];

              subs.push({'order': order,'title': title.replace("-"," "), 'path': path +'/'+file});


            });

             var order = file.split(".")[0];
             var title = file.split(".")[1];

            index.push({
              'order': order,
              'title': title.replace("-"," "),
              'path': path,
              'subs': subs
            });
        };
  });
  res.json(index);
});


module.exports = router;
