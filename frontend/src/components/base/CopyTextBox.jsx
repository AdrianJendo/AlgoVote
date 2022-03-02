import React from "react";
import { IconButton, Box } from "@mui/material";
import { styled } from "@mui/system";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
