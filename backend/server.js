const express = require("express");
const app = express();
const port = 5001;

app.get("/", (req, res) => {
	res.send(`Hello on ${port}!`);
});

app.listen(port);
