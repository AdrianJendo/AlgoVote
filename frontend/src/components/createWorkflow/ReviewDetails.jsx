import React, { useState } from "react";
import { Typography, Button, ButtonGroup } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled } from "@mui/system";
import ReviewInfoTable from "components/base/RenderTable";
import TimesTable from "components/createWorkflow/TimesTable";
import { buttonGroupSX } from "utils/Style/ParticipantsStyle";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const ReviewDetails = ({ handleNext, handleBack }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "75%",
        left: "50%",
        transform: "translate(-50%, 0)",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, padding: "30px" }}
      >
        Review the Vote Details
      </Typography>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Participants</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              display: "flex",
              maxHeight: "calc(80vh - 200px)",
            }}
          >
            <ReviewInfoTable stage="participants" />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              display: "flex",
              maxHeight: "calc(80vh - 200px)",
            }}
          >
            <ReviewInfoTable stage="candidates" />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Start {"&"} End Dates</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TimesTable />
        </AccordionDetails>
      </Accordion>
      <ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
        <Button onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>Next Step</Button>
      </ButtonGroup>
    </div>
  );
};

export default ReviewDetails;
