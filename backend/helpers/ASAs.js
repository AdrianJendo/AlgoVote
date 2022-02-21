import { algodClient } from "../server.js";

// Function used to print asset holding for account and assetId
export const getAssetHolding = async (account, assetId) => {
	try {
		const accountInfo = await algodClient.accountInformation(account).do();
		for (let i = 0; i < accountInfo["assets"].length; i++) {
			const assetInfo = accountInfo["assets"][i];
			if (assetInfo["asset-id"] == assetId) {
				return JSON.stringify(assetInfo, undefined, 2);
			}
		}
	} catch (err) {
		return err.message;
	}
};

// Function used to print created asset for account and assetId
export const getCreatedAsset = async (account, assetId) => {
	try {
		const accountInfo = await algodClient.accountInformation(account).do();
		for (let i = 0; i < accountInfo["created-assets"].length; i++) {
			const assetInfo = accountInfo["created-assets"][i];
			if (assetInfo["index"] == assetId) {
				return JSON.stringify(assetInfo["params"], undefined, 2);
			}
		}
	} catch (err) {
		return err.message;
	}
};
