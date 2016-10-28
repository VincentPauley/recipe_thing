var express = require('express'),
    app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(3000, function() {
    console.log('app listening on port 3000');
});
