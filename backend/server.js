import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser"; // allows us to take in post request bodies

import testRoutes from "./routes/test.js";

// Environment variables
dotenv.config();
const port = process.env.BACKEND_PORT || 5001;

// Express
const app = express();

// Route middleware
app.use("/test", testRoutes);

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send(`Listening on port ${port}!`);
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
