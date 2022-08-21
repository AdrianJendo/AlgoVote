import React, { useContext } from "react";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import Check from "@mui/icons-material/Check";

const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.primary.main,

  "& .background": {
    width: 24,
    height: 24,
    borderRadius: "50%",
    color: "#fff",
    backgroundColor:
      ownerState.active || ownerState.completed
        ? theme.palette.primary.main
        : theme.stepperButtonColor,
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StepIcon = (props) => {
  const { active, completed, icon, className } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? (
        // <div className="background">
        // 	<Check sx={{ fontSize: 20 }} />
        // </div>
        <Check />
      ) : (
        <div className="background">
          <div className="icon">
            <Typography
              sx={{
                fontSize: "12px",
                transform: "translate(8.5px, 3px)",
              }}
            >
              {icon}
            </Typography>
          </div>
        </div>
      )}
    </StepIconRoot>
  );
};

const WorkflowStepper = ({ steps }) => {
  const stepInfo = useContext(VoteInfoContext)[0];

  return (
    <StyledBox sx={{ maxWidth: 300 }}>
      <Stepper activeStep={stepInfo.activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
              StepIconComponent={StepIcon}
            >
              {step}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </StyledBox>
  );
};

export default WorkflowStepper;
