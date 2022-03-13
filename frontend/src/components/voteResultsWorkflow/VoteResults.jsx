import React, { useContext, useState } from "react";
import { Typography, Grid, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import { VoteResultsContext } from "context/VoteResultsContext";
import VoteResultsBox from "components/voteResultsWorkflow/VoteResultsBox";
import lookupVote from "utils/voteResultsWorkflow/LookupVote";
import ProgressBar from "components/base/ProgressBar";
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
	const [voteResults, setVoteResults] = useContext(VoteResultsContext);
	const [voteRefresh, setVoteRefresh] = useState(false);

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

	if (voteResults.voteStatus === "register") {
		Object.keys(voteResults.candidates)
			.sort()
			.forEach((candidate) => {
				candidatesInfo.push({
					caption: "",
					data: candidate,
				});
			});
	} else {
		generalInfo.push({
			caption: "Votes Casted",
			data: Object.values(voteResults.candidates).reduce(
				(sum, nextElem) => sum + nextElem,
				0
			),
		});
		generalInfo.push({
			caption: "Unique Votes",
			data: voteResults.numVoted,
		});
		generalInfo.push({
			caption: "Voter Percentage",
			data: `${
				Math.round(
					(voteResults.numVoted / voteResults.numRegistered) * 10000
				) / 100
			}%`,
		});
		Object.keys(voteResults.candidates)
			.sort()
			.forEach((candidate) => {
				candidatesInfo.push({
					caption: candidate,
					data: voteResults.candidates[candidate],
				});
			});
	}

	generalInfo.push({
		caption: "AppId",
		data: voteResults.appId,
		url: `${BASE_URL}/application/${voteResults.appId}`,
	});

	// Registration info
	generalInfo.push({
		caption: "Number of Voters",
		data: voteResults.numVoters,
	});

	generalInfo.push({
		caption: "Registered Voters",
		data: voteResults.numRegistered,
	});

	generalInfo.push({
		caption: "Registered Percentage",
		data: `${
			Math.round(
				(voteResults.numRegistered / voteResults.numVoters) * 10000
			) / 100
		}%`,
	});

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
			<Typography variant="h4" sx={{ flexGrow: 1, padding: "20px" }}>
				<b>{voteResults.voteTitle}</b>{" "}
				<IconButton
					onClick={async () => {
						setVoteRefresh(true);
						const lookupSuccess = await lookupVote(
							voteResults,
							setVoteResults
						);
						if (lookupSuccess) {
							setVoteRefresh(false);
						}
					}}
					disabled={voteRefresh}
				>
					<RefreshIcon />
				</IconButton>
			</Typography>
			{voteRefresh ? (
				<div style={{ padding: "50px" }}>
					<ProgressBar text="Reloading Vote Info..." />
				</div>
			) : (
				<div>
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
					<Typography>Vote Options:</Typography>
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
			)}
		</div>
	);
};

export default EnterVoteInfo;
