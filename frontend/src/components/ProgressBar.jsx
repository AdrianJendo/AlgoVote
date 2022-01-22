import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CircularProgressBar = (props) => {
	const getText = (val) => {
		console.log(val, val < 100);
		switch (val) {
			case 0:
				return "Creating vote token";
			case 20:
				return "Creating smart contract";
			case 40:
				return "Funding new accounts";
			case 60:
				return "Opting in to vote token";
			case 80:
				return "Opting in to contract";
			case 99:
				return "Exporting Vote Data";
			default:
				return "ERR";
		}
	};
	return (
		<Box sx={{ position: "relative", display: "inline-flex" }}>
			<CircularProgress
				size={200}
				thickness={2}
				variant="indeterminate"
				{...props}
			/>
			<Box
				sx={{
					top: "40%",
					left: 0,
					bottom: 0,
					right: 0,
					position: "absolute",
					// display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography
					variant="body1"
					component="div"
					color="text.secondary"
				>
					{getText(props.value)}
				</Typography>
				<br />
				<Typography
					variant="caption"
					component="div"
					color="text.secondary"
				>
					{`${Math.round(props.value)}%`}
				</Typography>
			</Box>
		</Box>
	);
};

export default CircularProgressBar;
