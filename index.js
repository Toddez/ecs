global.rootDir = __dirname;

const express = require('express');

const app = express();
app.use(express.static(`${global.rootDir}/public`));
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
