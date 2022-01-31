import React, { useContext } from "react";
import {
	Typography,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
} from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";
import { FillDiv, typographySX } from "utils/ParticipantsStyle";

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
			<Typography sx={typographySX(2)} variant="h5">
				Select the candidate you want to vote for
			</Typography>

			<FillDiv>
				<Typography>
					Select an option from the drop down menu
				</Typography>
				<FormControl sx={{ m: 3, minWidth: 200 }}>
					<InputLabel id="demo-simple-select-label">
						Candidates
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={participateInfo.selectedCandidate}
						label="Candidates"
						onChange={handleChange}
					>
						{participateInfo.candidates.map((candidate) => (
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
