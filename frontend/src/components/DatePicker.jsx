import * as React from "react";
import { TextField, Typography } from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import { DateValueContext } from "context/DateValueContext";
import { styled } from "@mui/system";

const typographySX = (top) => ({ position: "relative", top: `${top}%` });

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

const delay = 60 * 1000; // minutes (use delay of 5 minutes)

export default function ResponsiveDatePickers({
	earliestDate,
	selectedDate,
	endDate,
	startTime,
	label,
	timeLabel,
}) {
	const [dateValue, setDateValue] = React.useContext(DateValueContext);

	React.useEffect(() => {
		setDateValue({
			error: false,
			value: selectedDate ? selectedDate : earliestDate,
			timeValue: startTime
				? new Date(startTime.getTime() + delay)
				: new Date(earliestDate.getTime() + delay),
		});
	}, [setDateValue, earliestDate, selectedDate, startTime]);

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
		if (
			(startTime && newValue < new Date(startTime.getTime() + delay)) ||
			newValue < new Date(new Date().getTime() + delay)
		) {
			setDateValue({ ...dateValue, timeValue: newValue, error: true });
		} else {
			setDateValue({ ...dateValue, timeValue: newValue, error: false });
		}
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				What will be the choices for your vote?
			</Typography>
			<InlineDiv>
				<MarginDiv>
					<DatePicker
						label={label}
						openTo="day"
						views={["year", "month", "day"]}
						minDate={earliestDate}
						maxDate={endDate}
						value={dateValue.value}
						onChange={(newValue) => handeDateChange(newValue)}
						renderInput={(params) => <TextField {...params} />}
					/>
					{earliestDate && startTime && (
						<Typography sx={{ margin: "20px" }}>
							Start Date: {earliestDate.toDateString()}
						</Typography>
					)}
				</MarginDiv>
				<MarginDiv>
					<TimePicker
						label={timeLabel}
						value={dateValue.timeValue}
						onChange={(newValue) => {
							handleTimeChange(newValue);
						}}
						minTime={
							startTime && startTime > new Date()
								? new Date(startTime.getTime() + delay)
								: new Date(new Date().getTime() + delay)
						}
						renderInput={(params) => <TextField {...params} />}
					/>
					{earliestDate && startTime && (
						<Typography sx={{ margin: "20px" }}>
							Start Time: {startTime.toLocaleTimeString()}
						</Typography>
					)}
				</MarginDiv>
			</InlineDiv>
		</div>
	);
}
