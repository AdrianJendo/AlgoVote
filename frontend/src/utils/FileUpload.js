import * as XLSX from "xlsx";

// Handle .txt and .csv files
export const txtUploadHandler = (e, voteInfo, setVoteInfo, dataType) => {
	const participants = {}; // handling multiple votes right now, but update it in the future to support name:numVotes in the future ... for excel files just do adjacent cells
	const len = e.target.files.length;
	for (let i = 0; i < len; i++) {
		const file = e.target.files[i];
		let fileReader = new FileReader();
		try {
			fileReader.readAsText(file);
		} catch {}
		fileReader.onloadend = (e) => {
			const content = e.target.result
				.split("\n")
				.join(",")
				.split("\r")
				.join(",")
				.split(" ")
				.join(",")
				.split(","); // Split element in list of values
			for (let i = 0; i < content.length; i++) {
				if (content[i] !== "" && content[i].includes("@")) {
					const participant = content[i].toLowerCase();
					if (participants[participant]) {
						participants[participant]++;
					} else {
						participants[participant] = 1;
					}
				}
			}
			if (i === len - 1) {
				const newVoteInfo = Object.assign({}, voteInfo);
				newVoteInfo[dataType] = participants;
				setVoteInfo(newVoteInfo);
			}
		};
	}
};

// Handle excel upload
export const excelUploadHandler = async (
	e,
	voteInfo,
	setVoteInfo,
	dataType
) => {
	const participants = {}; // handling multiple votes right now, but update it in the future to support name:numVotes in the future ... for excel files just do adjacent cells
	const len = e.target.files.length;
	for (let i = 0; i < len; i++) {
		const file = e.target.files[i];
		const fileReader = new FileReader();
		fileReader.readAsBinaryString(file);

		fileReader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: "binary" });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
			const content = data
				.split("\n")
				.join(",")
				.split("\r")
				.join(",")
				.split(" ")
				.join(",")
				.split(","); // Split element in list of values
			/* Update state */
			for (let i = 0; i < content.length; i++) {
				if (content[i] !== "" && content[i].includes("@")) {
					const participant = content[i].toLowerCase();
					if (participants[participant]) {
						participants[participant]++;
					} else {
						participants[participant] = 1;
					}
				} else if (content[i] !== "" && dataType === "candidateData") {
					participants[content[i].toLowerCase()] = 1;
				}
			}
			if (i === len - 1) {
				const newVoteInfo = Object.assign({}, voteInfo);
				newVoteInfo[dataType] = participants;
				setVoteInfo(newVoteInfo);
			}
		};
	}
};
