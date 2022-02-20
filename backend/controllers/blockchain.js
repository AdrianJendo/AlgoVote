import { algodClient } from "../server.js";

export const blockchainStatus = async (req, res) => {
	try {
		const blockchainStatus = await algodClient.status().do();

		return res.send(blockchainStatus);
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
};

export const blockTimestamp = async (req, res) => {
	try {
		const blockRound = parseInt(req.query.blockRound);
		const block = await algodClient.block(blockRound).do();

		return res.send(new Date(block.block.ts * 1000));
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
};
