module.exports = () => {
console.clear();
global.users = {};
global.isPro = process.env.NODE_ENV == "production";

const exp = require("express");
const app = exp();
const fs = require('fs');
const path = require("path");
const port = process.env.PORT || 3000;
const router = require("./mods/router/main");
const cors = require("cors");

const options = {
  key: fs.readFileSync(path.resolve("src","bin", "secrets",'key.pem')),
  cert: fs.readFileSync(path.resolve("src","bin", "secrets",'cert.pem'))
};


app.use(cors());
app.use((req, res, next) => {
	res.on("finish", () => console.log(req.method, req.url, res.statusCode));
	next();
});

app.use(exp.static(path.resolve("src", "static", "public")));
app.use(router);

const server =  isPro ? require('http').createServer(app) : require('https').createServer(options , app);

const { Server } = require("socket.io");
const io = new Server(server,{
	cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

require("./mods/socket")(io);
server
.listen(port, () => console.log(`Server is live at ${port} port !`));
}
