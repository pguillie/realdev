var express = require('express');
var app = express();

const fs = require('fs');

const port = process.env.PORT;
const pageSize = parseInt(process.env.PAGE_SIZE);

let logs;

fs.readFile('db.json', (err, data) => {
    if (err) throw err;
    logs = JSON.parse(data).sort(function(a, b) {return b.pk - a.pk});
});

app.get('/logs', function(req, res) {

    let cursor = parseInt(req.query.cursor);

    while (typeof logs !== 'object') ;

    if (Number.isInteger(cursor) == false || cursor < 0 || cursor >= logs.length)
	cursor = 0;

    let nextPage;
    let prevPage;

    const baseCursor = Math.floor(cursor / pageSize) * pageSize;
    let nextCursor = baseCursor + pageSize;
    let prevCursor = baseCursor - pageSize;

    if (nextCursor < logs.length)
	nextPage = 'http://localhost:' + port + '/logs/?cursor=' + nextCursor;
    else
	nextPage = null;
    if (prevCursor >= 0)
	prevPage = 'http://localhost:' + port + '/logs/?cursor=' + prevCursor;
    else
	prevPage = null;

    var results = [];
    for (var i = baseCursor; i < (nextCursor < logs.length ? nextCursor : logs.length); i++)
	results.push(logs[i].fields);

    res.setHeader('Content-Type', 'text/plain');
    res.json({
	'next': nextPage,
	'previous': prevPage,
	'results': results
    });
});

app.listen(port);
