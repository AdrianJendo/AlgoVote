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
