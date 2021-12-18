import React from "react";
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Button,
	IconButton,
} from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import MUISwitch from "components/muiSwitch";

const TopAppBar = ({ dark, setDark }) => {
	const toggleSwitch = () => {
		setDark(!dark);
	};
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" style={{ height: "64px" }}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<HowToVoteIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						Algo Vote
					</Typography>
					<Button color="inherit">Home</Button>
					<Button color="inherit">Tutorial</Button>
					<Button color="inherit">About</Button>
					<MUISwitch defaultChecked toggleSwitch={toggleSwitch} />
					<Button color="inherit">My Votes</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default TopAppBar;
