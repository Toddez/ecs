global.rootDir = __dirname;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/file', function(req, res, next) {
  const filePath = path.normalize(req.body.path).replace(/^(\.\.[\/\\])+/, '');

  const file = fs.readFileSync(`${__dirname}/dist/${filePath}`, 'utf8');

  res.end(file);
});

app.use(express.static(`${global.rootDir}/dist`));
app.set('view engine', 'ejs');
app.set('views', `${global.rootDir}/views`);

app.get('/*', function(req, res, next) {
  res.render('index.ejs', {}, function(err, html) {
    res.send(html);
  });
});

app.listen(80, function() {
  console.log('Server started');
});
