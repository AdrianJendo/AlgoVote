import React from "react";
import { styled } from "@mui/system";
import VoteWorkflow from "components/base/VoteWorkflow";

const Dashboard = styled("div")(
	({ theme }) => `
		background-color: ${theme.palette.background.default};
		width: 100%;
		height: calc(100vh - 64px);
	`
);

const Base = () => {
	return (
		<Dashboard>
			<VoteWorkflow />
		</Dashboard>
	);
};

export default Base;
