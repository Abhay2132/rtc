const fs = require('fs');
const path = require("path");
const routes = require ("./routes");

module.exports = async function (req, res) {

let {url} = req,
	file = path.resolve("src", "static", "public", url);

if ( ! fs.existsSync(file)) return routes(req, res);

let content = "";
let writeH = [200, {
	"Content-Type" : "octet-stream"
}];
content = await new promise(a => fs.readFile(file, (e, d) => a(e.stack || d.toString())))
writeH[1]["Content-Length"] = fs.statSync(file).size;

res.writeHead(...writeH);
res.end(content);

}