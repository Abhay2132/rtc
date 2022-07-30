function addUser () {
	let unm = qs("#uid").value.replace(/\s/g, '');
	if ( ! unm ) return;
	socket.emit("new-user", unm);
	myUsername = unm;
	localStorage.setItem("unm", unm);
}

setTimeout (() => {
qs("#uid").value = localStorage.getItem("unm") || "";
setCamera();
}, 500);


socket.on("user-added", getUsers);
socket.on("new-user", setUsers);
socket.on("login-error", e => alert(e));

function getUsers () {
	qs("#login-menu").style.display = "none";
	qs("#users-list").style.display = "block";
	qs(".title-bar > span").textContent = "Online Users ! ";
	qs(".title-bar > button").style.display = "block"
	fetch("/getUsers")
	.then(data => data.json())
	.then(setUsers);
}

function setUsers ( users ) {
	if ( ! users.length || users.length < 2  ) return qs("#users-list").innerHTML = '<div class="message"> Nobody is Online ! </div>'
	qs("#users-list").innerHTML = ''
	users.forEach( user => {
		if ( user == myUsername ) return;
		qs("#users-list").innerHTML += `
				<div class="user">
						<span>${user}</span>
						<button onclick="callUser(this, '${user}')"> CALL </button>
					</div>`
	})
}

function callUser (button, user) {
	button.textContent = "Calling";
	targetUsername = user;
	invite ();
	remote.callback = () => {
		button.textContent = "CALL";
		toggleMute.reset();
	}
}

function end_call () {
	socket.emit("end-call", {type : "end-call", target : targetUsername});
	onCallEnd ();
}

function onCallEnd () {
	myPeerConn.close();
	remote.srcObject = null;
	local.srcObject = null;
	myPeerConn = null
	if (src) src.getTracks().forEach(t => t.stop());
	src = null;
	toggleMute.reset();
	toggleVideo.reset();
	qs(".fs-dialog-box").style.display = "flex";
}
socket.on("end-call", onCallEnd);

function logout () {
	qs("#login-menu").style.display = "block";
	qs("#users-list").style.display = "none";
	qs(".title-bar > span").textContent = "Enter Your Username";
	qs(".title-bar > button").style.display = "none"
	
	socket.emit("logout");
}

logout ();