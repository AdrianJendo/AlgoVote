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
import MUISwitch from "components/base/MuiSwitch";
import { useNavigate } from "react-router-dom";

const TopAppBar = ({ dark, setDark }) => {
	const navigate = useNavigate();

	const toggleSwitch = () => {
		setDark(!dark);
	};

	const changeRoute = (route) => {
		navigate(route);
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
						onClick={() => changeRoute("/")}
						sx={{ mr: 2 }}
					>
						<HowToVoteIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, cursor: "pointer" }}
						onClick={() => changeRoute("/")}
					>
						Algo Vote
					</Typography>
					<Button color="inherit" onClick={() => changeRoute("/")}>
						Home
					</Button>
					<Button
						color="inherit"
						onClick={() => changeRoute("/tutorial")}
					>
						Tutorial
					</Button>
					<Button
						color="inherit"
						onClick={() => changeRoute("/about")}
					>
						About
					</Button>
					<MUISwitch defaultChecked toggleSwitch={toggleSwitch} />
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default TopAppBar;
