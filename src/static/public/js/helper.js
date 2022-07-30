var myPeerConn;
var facingMode = "user";
var mediaConstraints = { audio: true, video: { facingMode } };
var src;
var socket = io();
var myUsername
var targetUsername
var remote = document.querySelector("#remote");
var local = document.querySelector("#local");

const qs = (a) => document.querySelector(a);

function setCameraMirror() {
	if (facingMode == "user") {
		local.style.transform = "scaleX(-1)";
	} else {
		local.style.transform = "scaleX(1)";
	}
}

async function setCamera(f = false) {
	if (f) {
		if (facingMode == "user") facingMode = "environment";
		else facingMode = "user";
	}
	mediaConstraints.video = { facingMode };
	if (src) src.getVideoTracks().forEach((t) => t.stop());
	src = await window.navigator.mediaDevices.getUserMedia(mediaConstraints);
	local.srcObject = src;
	setCameraMirror();

	if (myPeerConn && f) {
		let videoTrack = src.getTracks().find((track) => track.kind == "video");
		myPeerConn.getSenders().forEach((sender) => {
			if (sender.track.kind == "video") {
				sender.replaceTrack(videoTrack);
				//console.log("Replaced Track !");
			}
		});
	}
}

const toggleMute = {
	tag : qs(".mute"),
	muted : false,
	toggle : function toggleMute() {
		if (!myPeerConn) return;
		this.muted = ! this.muted;
		this.turn(this.muted);
		this.tag.style.background = this.muted ? "#bbb": "transparent";
	},
	turn : function (mute) {
		let sndrs = myPeerConn.getSenders();
		sndrs.forEach((s) => {
			if (s.track.kind == "audio") s.track.enabled = ! mute;
		});
	},
	reset : function () {
		this.muted = false;
		this.tag.style.background = "transparent";
		if ( myPeerConn ) this.turn(false);
	}
}

const toggleVideo = {
	tag : qs(".toggle-video"),
	video : true,
	toggle : function () {
		if (!myPeerConn) return;
		let sndrs = myPeerConn.getSenders();
		this.video = ! this.video;
		sndrs.forEach((s) => {
			if (s.track.kind == "video") s.track.enabled = this.video;
		});
		this.tag.style.background = this.video ? "transparent" : "#bbb";
	},
	reset : function () {
		this.video = true;
		this.tag.style.background = "transparent";
	}
}

const torch = {
	tag : qs(".torch"),
	isOn : false,
	toggle : function () {
		if ( ! src || facingMode == "user") return;
         this.isOn = ! this.isOn;
		src.getVideoTracks()[0]
		.applyConstraints({
            advanced: [{torch: this.isOn}]
          });
          this.tag.style.background = this.isOn ? "#bbb" : "transparent";
	}
}
 
var istoggleSrc = false;
function toggleSrc () {
	let lc = local.className
	let rc = remote.className
	
	local.className = rc;
	remote.className = lc;
}
