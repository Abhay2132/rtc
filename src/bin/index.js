module.exports = () => {

const https = require('https');
const fs = require('fs');
const path = require("path");

const options = {
  key: fs.readFileSync(path.resolve("src","bin", "secrets",'key.pem')),
  cert: fs.readFileSync(path.resolve("src","bin", "secrets",'cert.pem'))
};

https.createServer(options, require("./mods/rh/main"))
.listen(3000, () => console.log("Server is live at 3000 port !"));

}
