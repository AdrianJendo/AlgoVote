import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

const ButtonDiv = styled("div")({
	position: "absolute",
	left: "50%",
	top: "20%",
	transform: "translate(-50%, 0)",
});

const StyledBackground = styled("div")(
	({ theme }) => `
		height: 100%;
		background: ${theme.palette.background.paper};
		overflow-y: hidden;
	`
);

const ChooseOption = () => {
	return (
		<StyledBackground>
			<ButtonDiv>
				<Button
					variant="contained"
					onClick={() => console.log("BALLS")}
					sx={{ margin: "5px" }}
				>
					Create Vote
				</Button>
				<Button
					variant="contained"
					onClick={() => console.log("BALLS")}
					sx={{ margin: "5px" }}
				>
					Participate in Vote
				</Button>
				<Button
					variant="contained"
					onClick={() => console.log("BALLS")}
					sx={{ margin: "5px" }}
				>
					View Vote Results
				</Button>
			</ButtonDiv>
		</StyledBackground>
	);
};

export default ChooseOption;
