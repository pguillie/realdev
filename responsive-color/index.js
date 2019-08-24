var app = require('express')();
const fs = require('fs');
const verge = require('verge');

fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    config = JSON.parse(data);
    console.log('type: ' + typeof config + '\nvalue: ' + config[0][2]);
});

app.get('/', function(req, res) {

    res.send("OK");
}).listen('8080');


/*

[
  [375, 812, "blue"],
  [1024, 768, "#ccc"]
]

-----------------------

375 * 812 -> blue

414 * 736 -> #ccc

1365 * 978 -> none

*/
