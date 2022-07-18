const fs = require('fs');
const path = require("path");
const routes = require ("./routes");

module.exports = async function (req, res) {

let {url, method} = req,
	file = path.resolve("src", "static", "public", url);

console.log(method, url);

if ( ! fs.existsSync(file)) return routes(req, res);
if ( ! fs.statSync(file).isFile()) return routes(req, res);

console.log("Serving Static File !");
let content = "";
let writeH = [200, {
	"Content-Type" : "octet-stream"
}];
content = fs.readFileSync(file);
writeH[1]["Content-Length"] = fs.statSync(file).size;

res.writeHead(...writeH);
res.end(content);

}