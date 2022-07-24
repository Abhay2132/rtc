const router = require("express").Router()
const path = require("path");

router.get("/", (req, res) => {
	res.sendFile(path.resolve("src", "static", "public", "index.htm"));
});

router.get("/getUsers", (req, res) => {
	return res.json(Object.keys(users));
});

module.exports = router;