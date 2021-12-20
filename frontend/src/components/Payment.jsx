import React from "react";
import { Button, Typography } from "@mui/material";

const Payment = () => {
	return (
		<div
			style={{
				position: "relative",
				height: "100%",
				width: "60%",
				left: "20%",
			}}
		>
			<Typography
				variant="h6"
				component="div"
				sx={{ flexGrow: 1, padding: "10px" }}
			>
				Give Payment
			</Typography>
			<Button>Pay here</Button>
		</div>
	);
};

export default Payment;
