var express = require('express');
var router = express.Router();

var fs = require('fs');
var config = require('config');

var slug = require('slug');

var markdown = require( "markdown" ).markdown;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/serve/:chapter_title/:file_slug', function(req, res, next) {

   var startTime =  +new Date();

   var title = req.params.file_slug;
   var chapter = req.params.chapter_title;

   var bookPath = config.get('bookPath');
   var chapter_folder = "";
   var title_file="";

   var files = fs.readdirSync(bookPath);


    //Loop trough all directory to find chapter
   files.forEach(function(file) {
       var path = bookPath + "/" + file;
       var element = fs.statSync(path);

       if(element.isDirectory()){

           if(file.split('.')[1] == chapter){
                chapter_folder = file
           }
       }

   });

   //Loop trough file in chapter folder to find title file
   files = fs.readdirSync(bookPath+"/"+chapter_folder);

   files.forEach(function(file) {
       var path = bookPath +"/"+chapter_folder+ "/" + file;
       var element = fs.statSync(path);

       if(element.isFile()){

           if(file.split('.')[1] == slug(title)){
                title_file = file
           }
       }

   });


    var path = bookPath +"/"+chapter_folder+ "/" + title_file;

   if(chapter_folder != ""  && title_file != "")
   {

     fs.readFile(path, 'utf8', function (err,data) {
        if (err) {
             return console.log(err);
        }
       var  html_content = markdown.toHTML( data );

       var endTime = +new Date();
       var resp =  {'content' : html_content,
                    'gen-on' : new Date(),
                    'gen-time': endTime-startTime
                    }

            res.json(resp);
      });
    }else{
      res.json({'status': 'ERROR','message':'Cannot find the specified file.'});
    }



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

              subs.push({'type' :'file',
                          'order': order,
           //               'file-name' : file,
                          'title': title.replace("-"," "),
            //              'path': path,
                          'slug': slug(title)
                           });

            });

             var order = file.split(".")[0];
             var title = file.split(".")[1];

            index.push({
              'order': order,
              'title': title.replace("-"," "),
           //   'dir-name' : file,
           //   'path': path,
              'subs': subs,
              'slug': slug(title)
            });
        };
  });
  res.json(index);
});


module.exports = router;
