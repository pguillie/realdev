var app = require("express")();
var fs = require("fs");
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json();

const port = process.env.PORT;
const suggestionNumber = process.env.SUGGESTION_NUMBER;

var names;
fs.readFile("names.json", (err, data) => {
    if (err) throw err;
    names = JSON.parse(data);
});

function createNewObj(name, times) { return ({"name": name, "times": times}); }

function searchNames(name) {
    let result = [];
    let exactMatch;
    let pref = new RegExp("^" + name, "i");
    let full = new RegExp("^" + name + "$", "i");
    for (var n in names) {
	if (n.match(full)) {
	    exactMatch = createNewObj(n, names[n]);
	} else if (n.match(pref)) {
	    result.push(createNewObj(n, names[n]));
	}
    }
    result.sort(function (a, b) {return b.times - a.times});
    if (typeof exactMatch !== "undefined")
	result.unshift(exactMatch);

    return (result.splice(0, suggestionNumber));
};

function increment(name) {
    let regex = new RegExp("^" + name + "$", "i");
    for (var n in names) {
	if (n.match(regex)) {
	    names[n] += 1;
	    return (createNewObj(n, names[n]));
	}
    }
    throw name + " not found";
};

app.get("/typeahead", function(req, res) {
    res.status(200).json(searchNames(""));
}).get("/typeahead/:prefix", function(req, res) {
    res.status(200).json(searchNames(req.params.prefix));
}).post("/typeahead/set", jsonParser, function (req, res) {
    try {
	result = increment(req.body.name);
	res.status(200).json(result);
    } catch(e) {
	res.status(400).send("Invalid request (" + e + ")");
    }
}).listen(port);
