import fs from "fs";

export const readTeal = async (algodClient, filePath) => {
	const programBytes = fs.readFileSync(filePath);
	const compiledResponse = await algodClient.compile(programBytes).do();
	const compiledBytes = new Uint8Array(
		Buffer.from(compiledResponse.result, "base64")
	);
	return compiledBytes;
};
