import React from "react";
import { styled } from "@mui/system";

const StyledBackground = styled("div")(
	({ theme }) => `
		height: 100%;
		background: ${theme.palette.background.paper};
		overflow-y: hidden;
		`
);

const About = () => {
	return <StyledBackground>Tutorial Page</StyledBackground>;
};

export default About;
