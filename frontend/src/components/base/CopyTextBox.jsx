import React, { useContext } from "react";
import { IconButton, Box } from "@mui/material";
import { styled } from "@mui/system";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AlertContext } from "context/AlertContext";

const FlexBox = styled((props) => <Box {...props} />)(() => ({
	display: "flex",
	justifyContent: "center",
}));

const AddressBox = styled((props) => <Box {...props} />)(() => ({
	padding: "10px",
	border: "1px solid",
}));

const CopyIconBox = styled((props) => <Box {...props} />)(() => ({
	width: 50,
	border: "1px solid",
	cursor: "pointer",
}));

const CopyTextBox = (props) => {
	const { width, text } = props;
	const setOpen = useContext(AlertContext)[1];

	return (
		<FlexBox>
			<AddressBox
				sx={{
					width,
					borderRadius: 1,
					backgroundColor: "primary.dark",
				}}
			>
				{text}
			</AddressBox>
			<CopyIconBox
				sx={{
					borderRadius: 1,
					"&:hover": {
						backgroundColor: "primary.main",
					},
				}}
				onClick={() => {
					navigator.clipboard.writeText(text);
					setOpen(true);
					setTimeout(() => {
						setOpen(false);
					}, 2500);
				}}
			>
				<IconButton>
					<ContentCopyIcon />
				</IconButton>
			</CopyIconBox>
		</FlexBox>
	);
};

export default CopyTextBox;
