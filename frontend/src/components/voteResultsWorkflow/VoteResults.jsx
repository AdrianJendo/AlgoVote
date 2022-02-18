import React, { useContext } from "react";
import { Typography, Grid } from "@mui/material";
import { VoteResultsContext } from "context/VoteResultsContext";
import { styled } from "@mui/material/styles";
import VoteResultsBox from "components/voteResultsWorkflow/VoteResultsBox";
import { BASE_URL } from "constants";

function FormRow(props) {
	const { data } = props;
	return (
		<React.Fragment>
			{data.map((item, index) => (
				<Grid
					item
					xs={
						item.caption === "Creator"
							? 12
							: data.length >= 4
							? 3
							: 4
					}
					key={index}
					sx={{ marginBottom: "30px" }}
				>
					<VoteResultsBox
						caption={item.caption}
						data={item.data}
						url={item.url}
					/>
				</Grid>
			))}
		</React.Fragment>
	);
}

const StyledGrid = styled(Grid)(({ theme }) => ({
	padding: theme.spacing(2),
	display: "flex",
	justifyContent: "center",
}));

const EnterVoteInfo = () => {
	const voteResults = useContext(VoteResultsContext)[0];

	const generalInfo = [];
	const candidatesInfo = [];
	const tokenInfo = [];
	const dateInfo = [];

	if (voteResults.voteStatus === "register") {
		generalInfo.push({
			caption: "Stage",
			data: "Register",
		});
	} else if (voteResults.voteStatus === "vote") {
		generalInfo.push({
			caption: "Stage",
			data: "Voting",
		});
	} else if (voteResults.voteStatus === "complete") {
		generalInfo.push({
			caption: "Stage",
			data: "Vote Ended",
		});
	}

	generalInfo.push({
		caption: "AppId",
		data: voteResults.appId,
		url: `${BASE_URL}/application/${voteResults.appId}`,
	});

	if (voteResults.voteStatus === "register") {
		const registeredVoters = voteResults.numRegistered;
		generalInfo.push({
			caption: "Registered Voters",
			data: registeredVoters,
		});
		generalInfo.push({
			caption: "Registered Percentage",
			data: `${
				Math.round((registeredVoters / voteResults.numVoters) * 10000) /
				100
			}%`,
		});

		Object.keys(voteResults.candidates).forEach((candidate) => {
			candidatesInfo.push({
				caption: "",
				data: candidate,
			});
		});
	} else {
		generalInfo.push({
			caption: "Votes Casted",
			data: voteResults.castedVotes,
		});
		generalInfo.push({
			caption: "Vote Percentage",
			data: `${
				Math.round(
					(voteResults.castedVotes / voteResults.assetSupply) * 10000
				) / 100
			}%`,
		});
		Object.keys(voteResults.candidates).forEach((candidate) => {
			candidatesInfo.push({
				caption: candidate,
				data: voteResults.candidates[candidate],
			});
		});
	}

	tokenInfo.push({
		caption: "Asset Id",
		data: voteResults.assetId,
		url: `${BASE_URL}/asset/${voteResults.assetId}`,
	});
	tokenInfo.push({
		caption: "Circulating Supply",
		data: voteResults.assetSupply,
	});
	tokenInfo.push({
		caption: "Name & Unit",
		data: `${voteResults.assetName} (${voteResults.assetUnit})`,
	});

	dateInfo.push({ caption: "Vote Start", data: voteResults.voteBegin });
	dateInfo.push({ caption: "Vote End", data: voteResults.voteEnd });

	return (
		<div
			style={{
				position: "relative",
				height: "100%",
				width: "100%",
				overflow: "auto",
			}}
		>
			<Typography
				variant="h6"
				component="div"
				sx={{ flexGrow: 1, padding: "20px" }}
			>
				Vote Information
			</Typography>
			<Typography>General Info:</Typography>
			<StyledGrid container>
				<FormRow data={generalInfo} />
			</StyledGrid>
			<StyledGrid container>
				<FormRow
					data={[
						{
							caption: "Creator",
							data: voteResults.creator,
							url: `${BASE_URL}/address/${voteResults.creator}`,
						},
					]}
				/>
			</StyledGrid>
			<Typography>Candidates:</Typography>
			<StyledGrid container>
				<FormRow data={candidatesInfo} />
			</StyledGrid>
			{/* creator, assetId, numVotes, vote %, */}
			<Typography>Vote Token:</Typography> {/* candidates list */}
			<StyledGrid container>
				{/* vote token info (name, supply, ticker) */}
				<FormRow data={tokenInfo} />
			</StyledGrid>
			<Typography>Date Info:</Typography>
			{/* start and end dates */}
			<StyledGrid container>
				{/* vote token info (name, supply, ticker) */}
				<FormRow data={dateInfo} />
			</StyledGrid>
		</div>
	);
};

export default EnterVoteInfo;
