import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Tooltip,
  ButtonGroup,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { styled } from "@mui/system";
import isSameDate from "utils/createWorkflow/IsSameDate";
import { MINUTES_DELAY, DELAY } from "constants";
import HelpIcon from "@mui/icons-material/Help";
import { buttonGroupSX } from "utils/Style/ParticipantsStyle";

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
  dateValue,
  setDateValue,
  earliestDate,
  endDate,
  label,
  handleNext,
  handleBack,
}) {
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    if (label === "Start") {
      setDateValue(new Date(new Date().getTime() + DELAY + 60 * 1000));
    }
  }, [label, setDateValue]);

  const handeDateChange = (newValue) => {
    const earliestDay = new Date(
      earliestDate.getFullYear(),
      earliestDate.getMonth(),
      earliestDate.getDate()
    );
    const latestDay = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    if (isNaN(newValue) || newValue > latestDay || newValue < earliestDay) {
      setDateError(true);
      setDateValue(newValue);
    } else {
      setDateError(false);
      setDateValue(newValue);
    }
  };

  const handleTimeChange = (newValue) => {
    if (label === "Start") {
      if (
        isNaN(newValue) ||
        (isSameDate(dateValue, new Date()) &&
          newValue < new Date(new Date().getTime() + DELAY)) // handle case where we are trying to start a vote today and we try setting the time too early
      ) {
        setDateError(true);
      } else {
        setDateError(false);
      }
      setDateValue(newValue);
    } else {
      if (
        isNaN(newValue) ||
        (isSameDate(dateValue, earliestDate) &&
          (newValue < new Date(earliestDate.getTime() + DELAY) || // handle case where we are try to end the date on the same day but before the earliest time possible
            newValue < new Date(new Date().getTime() + DELAY))) // also need to check that the new value is not in the past
      ) {
        setDateError(true);
      } else {
        setDateError(false);
      }
      setDateValue(newValue);
    }
  };

  let minTime = new Date(0, 0, 0);
  if (isSameDate(dateValue, new Date())) {
    minTime = new Date(new Date().getTime() + DELAY);
  } else if (isSameDate(dateValue, earliestDate)) {
    minTime = new Date(earliestDate.getTime() + DELAY);
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Typography sx={{ padding: "30px" }} variant="h5">
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
            value={dateValue}
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
            value={dateValue}
            onChange={(newValue) => {
              handleTimeChange(newValue);
            }}
            minTime={minTime}
            renderInput={(params) => <TextField {...params} />}
          />
          {dateError && (
            <Tooltip
              sx={{
                position: "absolute",
                left: "69%",
                top: "35px",
              }}
              title={`${label} time must be at least ${MINUTES_DELAY} minutes from ${
                label === "Start" ? "now" : "start time"
              }.`}
              placement="right"
            >
              <HelpIcon />
            </Tooltip>
          )}
          {label === "End" && (
            <Typography sx={{ margin: "20px" }}>
              Start Time:{" "}
              {earliestDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          )}
        </MarginDiv>
      </InlineDiv>
      <ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
        <Button onClick={handleBack}>Back</Button>
        {!dateError && <Button onClick={handleNext}>Next Step</Button>}
      </ButtonGroup>
    </div>
  );
}
