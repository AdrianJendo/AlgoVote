import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser"; // allows us to take in post request bodies

import smartContractRoutes from "./routes/smartContracts.js";
import accountsRoutes from "./routes/accounts.js";
import ASARoutes from "./routes/ASAs.js";
import blockchainRoutes from "./routes/blockchain.js";

import algosdk from "algosdk";

import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import { ALGOD_SERVER, INDEXER_SERVER, ALGOD_PORT } from "./contants.js";

// Environment variables
dotenv.config();
export const BACKEND_PORT = process.env.BACKEND_PORT || 5001;
const ALGOD_TOKEN = process.env.ALGOD_TOKEN
	? {
			"X-API-Key": process.env.ALGOD_TOKEN,
	  }
	: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

// Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Route middleware
app.use("/algoAccount", accountsRoutes);
app.use("/asa", ASARoutes);
app.use("/smartContract", smartContractRoutes);
app.use("/blockchain", blockchainRoutes);

// Algorand
// create client object
let algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
let indexerClient = new algosdk.Indexer(
	ALGOD_TOKEN,
	INDEXER_SERVER,
	ALGOD_PORT
);

app.get("/", (req, res) => {
	res.send(`Listening on BACKEND_PORT ${BACKEND_PORT}!`);
});

app.listen(BACKEND_PORT, () => {
	console.log(`Server started on BACKEND_PORT ${BACKEND_PORT}`);
});

export { algodClient, indexerClient };
