import { styled } from "@mui/system";

export const FillDiv = styled("div")(
	() => `
		position:relative;
		top:30px
	`
);

export const Input = styled("input")({
	display: "none",
});

export const typographySX = (top) => ({ position: "relative", top: `${top}%` });
export const buttonGroupSX = (top) => ({
	position: "relative",
	top: `${top}px`,
});

export const TableDiv = styled("div")({
	position: "relative",
	height: "calc(100% - 180px)",
	width: "60%",
	left: "20%",
	top: "5%",
});

export const ManualUploadDiv = styled("div")({
	position: "relative",
	height: "calc(100% - 180px)",
	width: "96%",
	left: "2%",
	top: "5%",
});

export const ManualUploadSubDiv = styled("div")({
	padding: "10px",
});

export const TableSubDiv = styled("div")({
	position: "relative",
	height: "90%",
	width: "100%",
	padding: "10px",
});
