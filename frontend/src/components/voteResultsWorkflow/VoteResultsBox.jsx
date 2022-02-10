import { Typography, Box } from "@mui/material";

const VoteResultsBox = (props) => {
	const { caption, data } = props;
	return (
		<Box
			sx={{
				backgroundColor: "background.default",
				width: 300,
				height: 100,
				borderRadius: 2,
			}}
		>
			<Typography
				sx={{
					position: "absolute",
					padding: "5px",
					fontSize: "0.9rem",
					fontWeight: "200",
				}}
			>
				{caption}
			</Typography>
			<Typography
				sx={{
					position: "relative",
					top: "40%",
				}}
			>
				{data}
			</Typography>
		</Box>
	);
};

export default VoteResultsBox;
