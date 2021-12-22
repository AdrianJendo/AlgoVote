import * as React from "react";
import { styled } from "@mui/system";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const HelperTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.background.default,
		maxWidth: 600,
		fontSize: theme.typography.pxToRem(12),
	},
}));

export default HelperTooltip;
