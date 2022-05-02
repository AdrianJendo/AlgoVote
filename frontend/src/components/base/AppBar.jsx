import React from "react";
import { AppBar, Box, Toolbar, Typography, Button, Link } from "@mui/material";
import MUISwitch from "components/base/MuiSwitch";

const TopAppBar = ({ dark, setDark }) => {
	const toggleSwitch = () => {
		setDark(!dark);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" style={{ height: "64px" }}>
				<Toolbar>
					<Link href="/">
						<img
							src={"/algorand.png"}
							alt="Err"
							width="35px"
							style={{
								paddingRight: "25px",
								cursor: "pointer",
							}}
						/>
					</Link>
					<Link
						href="/"
						color="inherit"
						sx={{ flexGrow: 1 }}
						underline="none"
					>
						<Typography variant="h6" component="div">
							Algo Vote
						</Typography>
					</Link>
					<Link href="/" color="inherit" underline="none">
						<Button color="inherit">Home</Button>
					</Link>
					<Link href="/about" color="inherit" underline="none">
						<Button color="inherit">About</Button>
					</Link>
					{/* <MUISwitch defaultChecked toggleSwitch={toggleSwitch} /> */}
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default TopAppBar;
