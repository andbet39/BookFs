/**
 * Created by andreaterzani on 03/01/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {

    res.send('Home message');

});

module.exports = router;
