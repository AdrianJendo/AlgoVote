import * as XLSX from "xlsx";
import shouldAddPerson from "utils/createWorkflow/ShouldAddPerson";

// Handle .txt and .csv files
export const txtUploadHandler = (e, voteInfo, setVoteInfo, dataType) => {
	const participants = {};
	const len = e.target.files.length;
	for (let i = 0; i < len; i++) {
		// traverse each uploaded file
		const file = e.target.files[i];
		const fileReader = new FileReader();
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
			let numParticipants = 0;
			for (let j = 0; j < content.length; j++) {
				if (shouldAddPerson(content[j], dataType)) {
					numParticipants++;
					const participant =
						dataType === "participantData"
							? content[j].toUpperCase() // participants are addresses so enforce upper case,
							: content[j].toLowerCase(); // force candidates to be lower case for simplicity

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
				if (dataType === "participantData") {
					newVoteInfo.numParticipants = numParticipants;
				}
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
	const participants = {};
	const len = e.target.files.length;
	for (let i = 0; i < len; i++) {
		// traverse each uploaded file
		const file = e.target.files[i];
		const fileReader = new FileReader();
		try {
			fileReader.readAsBinaryString(file);
		} catch {}

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
				.split(","); // Split element in list of values
			/* Update state */
			let numParticipants = 0;
			for (let j = 0; j < content.length; j++) {
				if (shouldAddPerson(content[j], dataType)) {
					numParticipants++;
					const participant =
						dataType === "participantData"
							? content[j].toUpperCase() // participants are addresses so enforce upper case,
							: content[j].toLowerCase(); // force candidates to be lower case for simplicity

					if (participants[participant]) {
						participants[participant] += 1;
					} else {
						participants[participant] = 1;
					}
				}
			}
			if (i === len - 1) {
				const newVoteInfo = Object.assign({}, voteInfo);
				newVoteInfo[dataType] = participants;
				if (dataType === "participantData") {
					newVoteInfo.numParticipants = numParticipants;
				}
				setVoteInfo(newVoteInfo);
			}
		};
	}
};
