import React, { useContext } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";

import { FillDiv, typographySX, buttonGroupSX } from "utils/ParticipantsStyle";

const RegisterOrVote = () => {
	const [participateInfo, setParticipateInfo] =
		useContext(ParticipateContext);

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				Are you registering for a vote or voting?
			</Typography>

			<FillDiv>
				<Typography sx={typographySX(4)}>
					Select one of the options below
				</Typography>
				<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
					<Button
						onClick={() =>
							setParticipateInfo({
								...participateInfo,
								registerOrVote: "register",
							})
						}
					>
						Registering
					</Button>
					<Button
						onClick={() =>
							setParticipateInfo({
								...participateInfo,
								registerOrVote: "vote",
							})
						}
					>
						Voting
					</Button>
				</ButtonGroup>
			</FillDiv>
		</div>
	);
};

export default RegisterOrVote;
