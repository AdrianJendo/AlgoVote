import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DirectionsIcon from "@mui/icons-material/Directions";
import { VoteInfoContext } from "context/VoteInfoContext";
import shouldAddPerson from "utils/ShouldAddPerson";

export default function CustomizedInputBase({ index }) {
	const [textValue, setTextValue] = React.useState("");
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);

	const inputRef = React.useRef();

	const addValue = () => {
		const names = textValue.toLowerCase().split(" ").join("").split(",");
		const participants = voteInfo[index] ? voteInfo[index] : {};
		for (let i = 0; i < names.length; ++i) {
			const name = names[i];
			if (shouldAddPerson(name, voteInfo, index)) {
				if (participants[name] && index === "participantData") {
					participants[name]++;
				} else if (participants[name]) {
					alert("Candidate already exists in table");
					return;
				} else {
					participants[name] = 1;
				}
			} else {
				alert("Not valid");
				return;
			}

			if (i === names.length - 1) {
				const newVoteInfo = Object.assign({}, voteInfo);
				newVoteInfo[index] = participants;
				setVoteInfo(newVoteInfo);
				setTextValue("");
			}
		}
	};

	const handleChange = (e) => {
		setTextValue(e.target.value);
	};

	return (
		<Paper
			component="form"
			sx={{
				display: "flex",
				alignItems: "center",
				position: "relative",
				width: 300,
			}}
		>
			<InputBase
				sx={{ ml: 1, flex: 1 }}
				placeholder={`Add a${
					index === "participantData" ? "n address" : " candidate"
				}`}
				inputProps={{ "aria-label": "add participant" }}
				value={textValue}
				inputRef={inputRef}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						inputRef.current.blur();
					} else if (e.key === "Enter") {
						e.preventDefault();
						addValue();
					}
				}}
				onChange={handleChange}
			/>
			<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
			<IconButton
				color="primary"
				sx={{ p: "10px" }}
				aria-label="directions"
				onClick={addValue}
			>
				<DirectionsIcon />
			</IconButton>
		</Paper>
	);
}
