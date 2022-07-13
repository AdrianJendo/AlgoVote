import * as React from "react";
import { TextField, Typography, Tooltip } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateValueContext } from "context/DateValueContext";
import { styled } from "@mui/system";
import isSameDate from "utils/createWorkflow/IsSameDate";
import { MINUTES_DELAY, DELAY } from "constants";
import HelpIcon from "@mui/icons-material/Help";
import { typographySX } from "utils/Style/WorkflowStyle";

const InlineDiv = styled("div")(
	() => `
		position:relative;
		top:30px;
		display:flex; 
		justify-content: center; 
		align-items: center;
	`
);

const MarginDiv = styled("div")(
	() => `
		margin:20px;
	`
);

export default function ResponsiveDatePickers({
	earliestDate,
	earliestTime,
	selectedDate,
	selectedTime,
	endDate,
	label,
}) {
	const [dateValue, setDateValue] = React.useContext(DateValueContext);

	// Idk this some fucking nuts shit setting the right time was such a pain in the ass
	React.useEffect(() => {
		setDateValue({
			error: false,
			value: selectedDate ? selectedDate : earliestDate,
			timeValue: selectedTime
				? selectedTime
				: label === "Start"
					? new Date(new Date().getTime() + DELAY + 60 * 1000)
					: new Date(earliestTime.getTime() + DELAY + 60 * 1000),
		});
	}, [
		earliestDate,
		earliestTime,
		label,
		selectedDate,
		selectedTime,
		setDateValue,
	]);

	const handeDateChange = (newValue) => {
		const earliestDateDate = new Date(
			earliestDate.getFullYear(),
			earliestDate.getMonth(),
			earliestDate.getDate()
		);
		const endDateDate = new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate()
		);

		if (
			isNaN(newValue) ||
			newValue > endDateDate ||
			newValue < earliestDateDate
		) {
			setDateValue({ ...dateValue, value: newValue, error: true });
		} else {
			setDateValue({ ...dateValue, value: newValue, error: false });
		}
	};

	const handleTimeChange = (newValue) => {
		if (label === "Start") {
			if (
				isSameDate(dateValue.value, new Date()) &&
				newValue < new Date(new Date().getTime() + DELAY) // handle case where we are trying to start a vote today and we try setting the time too early
			) {
				setDateValue({
					...dateValue,
					timeValue: newValue,
					error: true,
				});
			} else {
				setDateValue({
					...dateValue,
					timeValue: newValue,
					error: false,
				});
			}
		} else {
			if (
				isSameDate(dateValue.value, earliestDate) &&
				(newValue < new Date(earliestTime.getTime() + DELAY) || // handle case where we are try to end the date on the same day but before the earliest time possible
					newValue < new Date(new Date().getTime() + DELAY)) // also need to check that the new value is not in the past
			) {
				setDateValue({
					...dateValue,
					timeValue: newValue,
					error: true,
				});
			} else {
				setDateValue({
					...dateValue,
					timeValue: newValue,
					error: false,
				});
			}
		}
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				When will your vote {label.toLowerCase()}?
			</Typography>
			<InlineDiv>
				<MarginDiv>
					<DatePicker
						label={`${label} Date`}
						openTo="day"
						views={["year", "month", "day"]}
						minDate={earliestDate}
						maxDate={endDate}
						value={dateValue.value}
						onChange={(newValue) => handeDateChange(newValue)}
						renderInput={(params) => <TextField {...params} />}
					/>
					{label === "End" && (
						<Typography sx={{ margin: "20px" }}>
							Start Date: {earliestDate.toDateString()}
						</Typography>
					)}
				</MarginDiv>
				<MarginDiv>
					<TimePicker
						label={`${label} Time`}
						value={dateValue.timeValue}
						onChange={(newValue) => {
							handleTimeChange(newValue);
						}}
						minTime={
							label === "Start"
								? isSameDate(dateValue.value, new Date())
									? new Date(new Date().getTime() + DELAY)
									: new Date(0, 0, 0)
								: isSameDate(dateValue.value, new Date()) // this one is a lot more complicated because we need to check (a) if the end date is today,
									? new Date(new Date().getTime() + DELAY)
									: isSameDate(dateValue.value, earliestDate) // and (b) if the date is the same date as the earliest start date
										? new Date(earliestTime.getTime() + DELAY)
										: new Date(0, 0, 0)
						}
						renderInput={(params) => <TextField {...params} />}
					/>
					{dateValue.error && (
						<Tooltip
							sx={{
								position: "absolute",
								left: "69%",
								top: "35px",
							}}
							title={`${label} time must be at least ${MINUTES_DELAY} minutes from ${label === "Start" ? "now" : "start time"
								}.`}
							placement="right"
						>
							<HelpIcon />
						</Tooltip>
					)}
					{label === "End" && (
						<Typography sx={{ margin: "20px" }}>
							Start Time: {earliestTime.toLocaleTimeString()}
						</Typography>
					)}
				</MarginDiv>
			</InlineDiv>
		</div>
	);
}
