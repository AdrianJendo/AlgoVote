import React, { useContext } from "react";
import {
	Typography,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
} from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";
import { FillDiv } from "utils/Style/ParticipantsStyle";
import { typographySX } from "utils/Style/WorkflowStyle";

const SelectCandidate = () => {
	const [participateInfo, setParticipateInfo] =
		useContext(ParticipateContext);

	const handleChange = (e) => {
		setParticipateInfo({
			...participateInfo,
			selectedCandidate: e.target.value,
		});
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h4">
				<b>{participateInfo.voteTitle}</b>
			</Typography>
			<FillDiv>
				<Typography>
					Select an option from the drop down menu
				</Typography>
				<FormControl sx={{ m: 3, minWidth: 200 }}>
					<InputLabel id="demo-simple-select-label">
						Options
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={participateInfo.selectedCandidate}
						label="Options"
						onChange={handleChange}
					>
						{participateInfo.candidates.sort().map((candidate) => (
							<MenuItem key={candidate} value={candidate}>
								{candidate}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</FillDiv>
		</div>
	);
};

export default SelectCandidate;
