import React, { useContext } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { AlertContext } from "context/AlertContext";

const StickyAlert = () => {
	const [open, setOpen] = useContext(AlertContext);
	return open ? (
		<Alert
			severity="success"
			variant="filled"
			sx={{
				position: "fixed",
				width: "250px",
				bottom: "15px",
				right: "25px",
			}}
			onClose={() => setOpen(false)}
		>
			<AlertTitle>Copied to clipboard</AlertTitle>
		</Alert>
	) : (
		<div />
	);
};

export default StickyAlert;
