import React, { useContext, useState } from "react";
import { Paper } from "@mui/material";
import { StepperDiv } from "utils/Style/WorkflowStyle";

// Create workflow
import { VoteInfoContext } from "context/VoteInfoContext";
import Stepper from "components/base/Stepper";
import SelectParticipants from "components/createWorkflow/SelectParticipants";
import SelectCandidates from "components/createWorkflow/SelectCandidates";
import DatePicker from "components/createWorkflow/DatePicker";
import ReviewDetails from "components/createWorkflow/ReviewDetails";
import Payment from "components/createWorkflow/Payment";
import Toolbar from "components/base/Toolbar";

import { AppBar, Box, Drawer, Divider } from "@mui/material";
import { styled } from "@mui/system";

import { MINUTES_DELAY, DELAY } from "constants";
import isSameDate from "utils/createWorkflow/IsSameDate";

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
  },
}));

const CreateVoteWorkflow = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
  const [dateValue, setDateValue] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const steps = [
    "Select Voting Participants",
    "Specify Vote Options",
    "Specify Start Date",
    "Specify End Date",
    "Review Details",
    "Payment & Title",
  ];

  const drawer = (
    <div>
      <AppBar style={{ height: "64px" }}>
        <Toolbar />
      </AppBar>
      <Divider />
      <StepperDiv>
        <Stepper steps={steps} />
      </StepperDiv>
    </div>
  );

  const container = window.document.body;

  const handleNext = () => {
    // Start date
    if (voteInfo.activeStep === 2) {
      if (
        !isSameDate(dateValue, new Date()) ||
        dateValue - new Date(new Date().getTime() + DELAY) > 0
      ) {
        setVoteInfo({
          ...voteInfo,
          activeStep: voteInfo.activeStep + 1,
          startDate: dateValue,
        });
        setDateValue(new Date(dateValue.getTime() + DELAY + 60 * 1000));
      } else {
        alert(
          `Update start time or date to be ${MINUTES_DELAY} minutes after the current time`
        );
      }
    }
    // End date
    else if (voteInfo.activeStep === 3) {
      if (
        !isSameDate(dateValue, new Date()) || // check if the date is today
        (dateValue - new Date(new Date().getTime() + DELAY) > 0 && // or we are choosing a time in the future
          dateValue - new Date(voteInfo.startDate.getTime() + DELAY) > 0)
      ) {
        setVoteInfo({
          ...voteInfo,
          activeStep: voteInfo.activeStep + 1,
          endDate: dateValue,
        });
      } else {
        alert(
          `Update end time or date to be ${MINUTES_DELAY} minutes after the start time`
        );
      }
    } else {
      setVoteInfo({
        ...voteInfo,
        activeStep: voteInfo.activeStep + 1,
      });
    }
  };

  const handleBack = () => {
    setVoteInfo({ ...voteInfo, activeStep: voteInfo.activeStep - 1 });
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <StyledDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          {drawer}
        </StyledDrawer>
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100%",
        }}
      >
        <Paper
          sx={{
            height: "100%",
            width: "100%",
            textAlign: "center",
          }}
        >
          {voteInfo.activeStep === 0 && (
            <SelectParticipants handleNext={handleNext} />
          )}
          {voteInfo.activeStep === 1 && (
            <SelectCandidates handleNext={handleNext} />
          )}
          {voteInfo.activeStep === 2 && (
            <DatePicker
              dateValue={dateValue}
              setDateValue={setDateValue}
              earliestDate={new Date(new Date().getTime() + DELAY + 60000)} // earliest start date is today
              endDate={
                new Date(
                  new Date().getFullYear() + 7, // set endDate to 7 years in the future
                  new Date().getMonth(),
                  new Date().getDate()
                )
              }
              label="Start"
              handleNext={handleNext}
              handleBack={handleBack}
            />
          )}
          {voteInfo.activeStep === 3 && (
            <DatePicker
              dateValue={dateValue}
              setDateValue={setDateValue}
              earliestDate={new Date(voteInfo.startDate.getTime())}
              endDate={
                new Date(
                  voteInfo.startDate.getFullYear() + 7, // set endDate to 7 years in the future
                  voteInfo.startDate.getMonth(),
                  voteInfo.startDate.getDate()
                )
              }
              label="End"
              handleNext={handleNext}
              handleBack={handleBack}
            />
          )}
          {voteInfo.activeStep === 4 && (
            <ReviewDetails handleNext={handleNext} handleBack={handleBack} />
          )}
          {voteInfo.activeStep === 5 && <Payment handleBack={handleBack} />}
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateVoteWorkflow;
