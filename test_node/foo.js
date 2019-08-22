var express = require('express');
var ftp = require('ftp');
var argv = require('minimist')(process.argv);


if ('p' in argv == false || typeof(argv['p']) != 'string')
    process.exit(1);

console.log("File path: " + argv['p']);


var app = express();

app.get('/:file', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Page:' + req.params.file);
});

app.listen(8080);


var client = new ftp();
client.on('ready', function() {
    client.put(argv['p'], 'test_file', function(err) {
    	if (err) throw err;
    	client.end();
    });
});
client.connect({host: '10.11.5.14', port: '1234', user: 'pguillie'});
