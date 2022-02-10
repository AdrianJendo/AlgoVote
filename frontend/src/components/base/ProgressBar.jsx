import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const BoxDiv = styled((props) => <Box {...props} />)(() => ({
	top: "40%",
	left: 0,
	bottom: 0,
	right: 0,
	position: "absolute",
	// display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const CircularProgressBar = (props) => {
	const { value, getText, text } = props;

	return (
		<Box sx={{ position: "relative", display: "inline-flex" }}>
			<CircularProgress
				size={200}
				thickness={2}
				variant="indeterminate"
				{...props}
			/>
			{value ? (
				<BoxDiv>
					<Typography
						variant="body1"
						component="div"
						color="text.secondary"
					>
						{getText(value)}
					</Typography>
					<br />
					<Typography
						variant="caption"
						component="div"
						color="text.secondary"
					>
						{`${Math.round(value)}%`}
					</Typography>
				</BoxDiv>
			) : (
				<BoxDiv>
					<Typography
						variant="caption"
						component="div"
						color="text.secondary"
					>
						{text}
					</Typography>
				</BoxDiv>
			)}
		</Box>
	);
};

export default CircularProgressBar;
