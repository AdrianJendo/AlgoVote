// Function used to print asset holding for account and assetid
export const printAssetHolding = async function (
	algodclient,
	account,
	assetid
) {
	// note: if you have an indexer instance available it is easier to just use this
	//     let accountInfo = await indexerClient.searchAccounts()
	//    .assetID(assetIndex).do();
	// and in the loop below use this to extract the asset for a particular account
	// accountInfo['accounts'][idx][account]);
	let accountInfo = await algodclient.accountInformation(account).do();
	for (let idx = 0; idx < accountInfo["assets"].length; idx++) {
		let scrutinizedAsset = accountInfo["assets"][idx];
		if (scrutinizedAsset["asset-id"] == assetid) {
			let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
			console.log("assetholdinginfo = " + myassetholding);
			return myassetholding;
		}
	}
};

// Function used to print created asset for account and assetid
export const printCreatedAsset = async function (
	algodclient,
	account,
	assetid
) {
	// note: if you have an indexer instance available it is easier to just use this
	//     let accountInfo = await indexerClient.searchAccounts()
	//    .assetID(assetIndex).do();
	// and in the loop below use this to extract the asset for a particular account
	// accountInfo['accounts'][idx][account]);
	let accountInfo = await algodclient.accountInformation(account).do();
	for (let idx = 0; idx < accountInfo["created-assets"].length; idx++) {
		let scrutinizedAsset = accountInfo["created-assets"][idx];
		if (scrutinizedAsset["index"] == assetid) {
			console.log("AssetID = " + scrutinizedAsset["index"]);
			let myparms = JSON.stringify(
				scrutinizedAsset["params"],
				undefined,
				2
			);
			console.log("parms = " + myparms);
			return myparms;
		}
	}
};
