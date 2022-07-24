module.exports = () => {
console.clear();
global.users = {};

const exp = require("express");
const app = exp();
const fs = require('fs');
const path = require("path");
const port = process.env.PORT || 3000;
const router = require("./mods/router/main");
const options = {
  key: fs.readFileSync(path.resolve("src","bin", "secrets",'key.pem')),
  cert: fs.readFileSync(path.resolve("src","bin", "secrets",'cert.pem'))
};

app.use((req, res, next) => {
	res.on("finish", () => console.log(req.method, req.url, res.statusCode));
	next();
});

app.use(exp.static(path.resolve("src", "static", "public")));
app.use(router);

const server = require('https').createServer(options , app);

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
	//console.log("Socket connected !");
	function handle_msg (msg) {
		if ( ! Object.keys(users).includes(msg.target)) return;
		socket.to(users[msg.target]).emit(msg.type, msg);
		console.log(msg);
	}
	socket.on("video-offer", handle_msg);
	socket.on("video-answer", handle_msg);
	socket.on("new-ice-candidate", handle_msg)
	socket.on("end-call", handle_msg);
	socket.on("new-user", (uid) => {
		if ( Object.keys(users).includes(uid) ) return socket.emit("login-error" , "Username already exists !");
		users[uid] = socket.id;
		socket.emit("user-added");
		console.log("user %s connected", uid, users);
		socket.broadcast.emit("new-user", Object.keys(users));
	});
	
	socket.on("disconnect", () => {
	console.log("disconnected %s",socket.id);
	for(let user in users ) if ( users[user] == socket.id ) delete users[user]
	socket.broadcast.emit("new-user", Object.keys(users));
});
});

server
.listen(port, () => console.log(`Server is live at ${port} port !`));
}
