const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.BACKEND_PORT;

app.get("/", (req, res) => {
	debugger;
	res.send(`Here is environment variable ${port}!`);
});
console.log("PORT", port);

app.listen(port);
