var express = require('express');
var app = express();

const fs = require('fs');

const port = process.env.PORT;

// read database file
let logs;
fs.readFile('db.json', (err, data) => {
    if (err) throw err;
    logs = JSON.parse(data).sort(function(a, b) {return b.pk - a.pk});
});

app.get('/logs', function(req, res) {

    // get cursor and page size
    let cursor;
    var pageSize = parseInt(process.env.PAGE_SIZE);
    if (isNaN(pageSize))
	pageSize = 2;
    if (typeof req.query.cursor === 'undefined')
	cursor = 0;
    else
	cursor = parseInt(req.query.cursor);

    // wait for the file to be read
    while (typeof logs !== 'object') ;

    // check request validity
    if (Number.isInteger(cursor) == false
	|| cursor < 0 || cursor >= logs.length) {
	res.status(400).send('Bad request');
	return ;
    }

    // set next and prev
    let nextPage, nextCursor, prevPage, prevCursor;
    const baseCursor = Math.floor(cursor / pageSize) * pageSize;
    nextCursor = baseCursor + pageSize;
    prevCursor = baseCursor - pageSize;
    if (nextCursor < logs.length)
	nextPage = 'http://localhost:' + port + '/logs/?cursor=' + nextCursor;
    else
	nextPage = null;
    if (prevCursor >= 0)
	prevPage = 'http://localhost:' + port + '/logs/?cursor=' + prevCursor;
    else
	prevPage = null;

    // prepare and send output
    var results = [];
    var i = (nextCursor < logs.length ? nextCursor : logs.length);
    while (i-- > baseCursor)
	results.unshift(logs[i].fields);

    res.status(200).json({
	'next': nextPage,
	'previous': prevPage,
	'results': results
    });
}).listen(port);
