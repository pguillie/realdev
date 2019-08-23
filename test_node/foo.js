var express = require('express');
var app = express();

const fs = require('fs');
var sortJsonArray = require('sort-json-array');

const port = process.env.PORT;
const pageSize = process.env.PAGE_SIZE;

app.get('/logs', function(req, res) {
    fs.readFile('db.json', (err, data) => {
	if (err) throw err;
	logs = sortJsonArray(JSON.parse(data), 'pk', 'des');
	res.setHeader('Content-Type', 'text/plain');
	res.json([pageSize, logs[0], logs[1]]);
    });
});

app.listen(port);
