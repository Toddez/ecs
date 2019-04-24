global.rootDir = __dirname;

const fs = require('fs');
const express = require('express');

var app = express();
app.use(express.static(global.rootDir + '/public'));
app.set('view engine', 'ejs');
app.set('views', global.rootDir + '/views');

app.get('/*', function(req, res, next) {
    res.render('index.ejs', {}, function(err, html) {
        res.send(html);
    });
});

app.listen(80, function() {
    console.log('Server started');
});