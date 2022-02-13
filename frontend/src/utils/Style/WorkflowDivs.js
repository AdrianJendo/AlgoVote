import { styled } from "@mui/system";

export const StepperDiv = styled("div")({
	position: "fixed",
	left: "2%",
	top: "80px",
});

export const PaperDiv = styled("div")(
	({ theme }) => `
		height: 100%;
		width: 100%;
		background: ${theme.palette.background.default};
	`
);
