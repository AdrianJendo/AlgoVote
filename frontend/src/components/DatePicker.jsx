import * as React from "react";
import { TextField, Typography, Button } from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import { VoteInfoContext } from "context/VoteInfoContext";
import { styled } from "@mui/system";

const typographySX = (top) => ({ position: "relative", top: `${top}%` });
const inlineSX = (margin) => ({ margin: `${margin}px` });

const FillDiv = styled("div")(
	() => `
		position:relative;
		top:30px;
		display:flex; 
		justify-content: center; 
		align-items: center;
	`
);

export default function ResponsiveDatePickers({
	earliestDate,
	selectedDate,
	endDate,
	label,
}) {
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);
	const [value, setValue] = React.useState(
		selectedDate ? selectedDate : earliestDate
	);

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				What will be the choices for your vote?
			</Typography>
			<FillDiv>
				<DatePicker
					label={label}
					openTo="day"
					views={["year", "month", "day"]}
					minDate={earliestDate}
					maxDate={endDate}
					value={value}
					onChange={(newValue) => {
						setValue(newValue);
					}}
					renderInput={(params) => <TextField {...params} />}
				/>

				<Button
					sx={inlineSX(20)}
					variant="contained"
					onClick={() =>
						setVoteInfo({
							...voteInfo,
							activeStep: voteInfo.activeStep + 1,
							startDate:
								label === "Start Date"
									? value
									: voteInfo.startDate,
							endDate:
								label === "End Date" ? value : voteInfo.endDate,
						})
					}
				>
					Confirm
				</Button>
			</FillDiv>
		</div>
	);
}
