import React, { useState } from "react";
import { Typography } from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/system";
import StickyHeadTable from "components/RenderTable";
import TimesTable from "components/TimesTable";

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

const ReviewDetails = () => {
	const [expanded, setExpanded] = useState("panel1");

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<div
			style={{
				position: "relative",
				height: "100%",
				width: "60%",
				left: "20%",
			}}
		>
			<Typography
				variant="h6"
				component="div"
				sx={{ flexGrow: 1, padding: "10px" }}
			>
				Review the Vote Details
			</Typography>
			<Accordion
				expanded={expanded === "panel1"}
				onChange={handleChange("panel1")}
			>
				<AccordionSummary
					aria-controls="panel1d-content"
					id="panel1d-header"
				>
					<Typography>Participants</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<StickyHeadTable stage="participants" />
				</AccordionDetails>
			</Accordion>
			<Accordion
				expanded={expanded === "panel2"}
				onChange={handleChange("panel2")}
			>
				<AccordionSummary
					aria-controls="panel2d-content"
					id="panel2d-header"
				>
					<Typography>Candidates</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<StickyHeadTable stage="candidates" />
				</AccordionDetails>
			</Accordion>
			<Accordion
				expanded={expanded === "panel3"}
				onChange={handleChange("panel3")}
			>
				<AccordionSummary
					aria-controls="panel3d-content"
					id="panel3d-header"
				>
					<Typography>Start {"&"} End Dates</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<TimesTable />
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default ReviewDetails;
