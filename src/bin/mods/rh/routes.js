const fs = require('fs');
const path = require("path");

function home (res) {
	let index = path.resolve("src", "static", "public", "index.htm");
	
	res.writeHead(200, {
		"Content-Type" : "text/html",
		"Content-Length" : fs.statSync(index).size
	});
	fs.readFile(index, (err, bin) => {
		if (err) res.end(err.stack);
		res.end(bin.toString());
	})
}

module.exports = async function (req , res ) {
	let c = '404 : NOT FOUND !';
	let {url, method} = req
	
	//if ( url == "/") return home(res);
	switch ( method ) {
		case "GET" : {
			switch(url){
				case "/" : return home(res);
			}
		}
	}
	
	res.writeHead( 404, {
		"Content-Type" : "plain/text",
		"Content-Length" : c.length
	});
	return res.end(c);
}