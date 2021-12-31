import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser"; // allows us to take in post request bodies

import smartContractRoutes from "./routes/smartContracts.js";
import accountsRoutes from "./routes/accounts.js";
import ASAsRoutes from "./routes/ASAs.js";
import testRoutes from "./routes/test.js";
import submitVoteRoutes from "./routes/submit.js";

import algosdk from "algosdk";

import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Environment variables
dotenv.config();
const port = process.env.BACKEND_PORT || 5001;

// Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Route middleware
app.use("/algoAccount", accountsRoutes);
app.use("/asa", ASAsRoutes);
app.use("/smartContract", smartContractRoutes);
app.use("/test", testRoutes);
app.use("/submitVote", submitVoteRoutes);

// Algorand
// create client object to connect to sandbox's algod client
const algodToken =
	"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = 4001;
let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

app.get("/", (req, res) => {
	res.send(`Listening on port ${port}!`);
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

export { algodClient };
