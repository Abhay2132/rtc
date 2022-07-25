const router = require("express").Router()
const path = require("path");

router.get("/", (req, res) => {
	let index = path.resolve("src", "static", "public", "index.htm");
	console.log(index);
	res.sendFile(index);
});

router.get("/getUsers", (req, res) => {
	return res.json(Object.keys(users));
});

module.exports = router;