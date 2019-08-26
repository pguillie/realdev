var app = require('express')();
const fs = require('fs');

var config;

fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    config = JSON.parse(data);
});

app.get('/', function(req, res) {
    let str = JSON.stringify(config);
    res.render('bg.ejs', {jsConfig: str});
}).listen('8000');
