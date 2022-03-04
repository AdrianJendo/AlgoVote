import React, { useContext } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import MUISwitch from "components/base/MuiSwitch";
import { VoteInfoContext } from "context/VoteInfoContext";
import { ParticipateContext } from "context/ParticipateContext";
import { VoteResultsContext } from "context/VoteResultsContext";
import changeRoute from "utils/misc/ChangeRoute";
import { useNavigate } from "react-router-dom";

const TopAppBar = ({ dark, setDark }) => {
	const setVoteInfo = useContext(VoteInfoContext)[1];
	const setParticipateInfo = useContext(ParticipateContext)[1];
	const setVoteResults = useContext(VoteResultsContext)[1];
	const navigate = useNavigate();

	const toggleSwitch = () => {
		setDark(!dark);
	};

	const nav = (route) => {
		changeRoute(
			navigate,
			route,
			setVoteInfo,
			setParticipateInfo,
			setVoteResults
		);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" style={{ height: "64px" }}>
				<Toolbar>
					<img
						onClick={() => nav("/")}
						src={"/algorand.png"}
						alt="Err"
						height="35px"
						style={{
							paddingRight: "25px",
							cursor: "pointer",
						}}
					/>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, cursor: "pointer" }}
						onClick={() => nav("/")}
					>
						Algo Vote
					</Typography>
					<Button color="inherit" onClick={() => nav("/")}>
						Home
					</Button>
					<Button color="inherit" onClick={() => nav("/about")}>
						About
					</Button>
					<MUISwitch defaultChecked toggleSwitch={toggleSwitch} />
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default TopAppBar;
