module.exports = io => {
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
}