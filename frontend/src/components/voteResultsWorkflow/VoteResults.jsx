import React, { useContext } from "react";
import { Typography, Grid } from "@mui/material";
import { VoteResultsContext } from "context/VoteResultsContext";
// import { styled } from "@mui/material/styles";
import VoteResultsBox from "components/voteResultsWorkflow/VoteResultsBox";

// const Item = styled(Paper)(({ theme }) => ({
// 	...theme.typography.body2,
// 	padding: theme.spacing(1),
// 	textAlign: "center",
// 	color: theme.palette.text.secondary,
// }));

function FormRow(props) {
	const { data } = props;
	return (
		<React.Fragment>
			{data.map((item, index) => (
				<Grid item xs={4} key={index}>
					<VoteResultsBox caption={item.caption} data={item.data} />
				</Grid>
			))}
		</React.Fragment>
	);
}

const EnterVoteInfo = () => {
	const [voteResults, setVoteResults] = useContext(VoteResultsContext);

	const generalInfo = [];
	generalInfo.push({ caption: "Nan", data: "Non" });
	generalInfo.push({ caption: "Nan", data: "Non" });
	generalInfo.push({ caption: "Nan", data: "Non" });

	const data = [];
	data.push({ caption: "Token Name", data: voteResults.assetName });
	data.push({ caption: "Circulating Supply", data: voteResults.assetSupply });
	data.push({ caption: "Token Unit", data: voteResults.assetUnit });

	return (
		<div
			style={{
				position: "relative",
				height: "100%",
				width: "80%",
				left: "10%",
			}}
		>
			<Typography
				variant="h6"
				component="div"
				sx={{ flexGrow: 1, padding: "10px" }}
			>
				Vote Information
			</Typography>
			<Typography>General Info:</Typography>
			<Grid container>
				{/* vote token info (name, supply, ticker) */}
				<FormRow data={generalInfo} />
			</Grid>
			{/* creator, assetId, numVotes, vote %, */}
			<Typography>Vote token info:</Typography> {/* candidates list */}
			<Grid container>
				{/* vote token info (name, supply, ticker) */}
				<FormRow data={data} />
			</Grid>
			<Typography>Recent votes:</Typography>
			{/* recent votes and who they voted for */}
			<Grid container>
				{/* vote token info (name, supply, ticker) */}
				<FormRow data={data} />

				{/* <Grid container item spacing={3}>
					<FormRow />
				</Grid>
				<Grid container item spacing={3}>
					<FormRow />
				</Grid> */}
			</Grid>
			<Typography>Start and end dates:</Typography>
			{/* start and end dates */}
			<Grid container>
				{/* vote token info (name, supply, ticker) */}
				<FormRow data={data} />
			</Grid>
		</div>
	);
};

export default EnterVoteInfo;
