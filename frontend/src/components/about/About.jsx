import React from "react";
import { Typography, Paper, Link } from "@mui/material";
import { styled } from "@mui/system";
import { typographySX } from "utils/Style/WorkflowStyle";
import { BTC_ADDR, ETH_ADDR, ALGO_ADDR } from "constants";
import CopyTextBox from "components/base/CopyTextBox";

const AboutDiv = styled("div")({
	position: "relative",
	top: "5%",
	margin: "0 auto",
	width: "70%",
	alignItems: "center",
	paddingBottom: "50px",
});

const StyledListItem = styled("li")({
	textAlign: "left",
	fontSize: "16px",
	marginBottom: "8px",
});

const BTC_QR = require("images/BTC.png");
const ETH_QR = require("images/ETH.png");
const ALGO_QR = require("images/ALGO.png");

const About = () => {
	return (
		<Paper
			sx={{
				height: "100%",
				width: "100%",
				textAlign: "center",
				overflowY: "auto",
				overflowX: "hidden"
			}}
		>
			<AboutDiv>
				<Typography sx={typographySX(6)} variant="h5">
					About Algo Vote
				</Typography>
				<hr />
				<Typography variant="h6">
					<b>DISCLAIMER</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					This app is using testnet and meant only as a proof of
					concept, don't use mainnet accounts when interacting with
					it.
					<br />A new testnet account can be <b>created</b> by
					clicking{" "}
					<Link
						href="/createCreatorAccount"
						target="_blank"
						underline="hover"
					>
						here
					</Link>{" "}
					and <b>funded</b> by clicking{" "}
					<Link
						href="https://bank.testnet.algorand.network/"
						target="_blank"
						underline="hover"
					>
						here
					</Link>
					.
				</Typography>
				<Typography variant="h6">
					<b>About</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					This app was created as a proof of concept for how a
					decentralized voting system could work. The frontend and
					backend are both hosted in a centralized manner to provide
					convenience to the end user, but all voting logic is carried
					out using smart contracts on the algorand blockchain. Thus,
					it is possible (but much less convenient) to handle all
					aspects of the voting process by interacting with the smart
					contract directly on the blockchain instead of using this
					app.
				</Typography>
				<Typography variant="h6">
					<b>Basic Voting Workflow</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>
						Step 1:{" "}
						<Link
							href="/createVote"
							target="_blank"
							underline="hover"
						>
							Create the vote
						</Link>
					</b>
				</Typography>
				<ul>
					<StyledListItem>Click 'Create Vote'.</StyledListItem>
					<StyledListItem>
						Select 'New Accounts' if you want to generate new
						algorand accounts (or if you want to mix new accounts
						with existing accounts) or 'Pre-Funded Accounts' if you
						already have accounts ready to use for the vote. <br />
						<i>
							Note: making new accounts is more expensive because
							it's assumed that the creator will fund them all
							with the minimum algo balance required for the vote.
						</i>
					</StyledListItem>
					<StyledListItem>
						Add candidates for the vote, either by uploaded a csv or
						excel file, or entering them manually.
					</StyledListItem>
					<StyledListItem>
						Enter a start date & time for the vote (must start at
						some point in the future).
					</StyledListItem>
					<StyledListItem>
						Enter an end date & time for the vote.
					</StyledListItem>
					<StyledListItem>
						After reviewing the details, paste the secret key of the
						account that will be used to fund the vote.
					</StyledListItem>
					<StyledListItem>
						If the transactions are successful, a link will appear
						to view the smart contract on the blockchain and an
						excel file with all the vote details will be created.
					</StyledListItem>
				</ul>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>
						Step 2:{" "}
						<Link
							href="/participateVote"
							target="_blank"
							underline="hover"
						>
							Participate in the vote
						</Link>
					</b>
				</Typography>
				<ul>
					<StyledListItem>
						Any prefunded accounts must register to participate in
						the vote (registration <b>MUST HAPPEN</b> before the
						vote starts).
						<br />
						<i>
							Note: new accounts are automatically opted in to the
							vote when the vote is created.
						</i>
					</StyledListItem>
					<StyledListItem>
						Once the vote begins, all registered participants can
						use the 'Voting' workflow to select their candidate of
						choice and cast their vote.
					</StyledListItem>
				</ul>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>
						Step 3:{" "}
						<Link
							href="/voteResults"
							target="_blank"
							underline="hover"
						>
							View the vote results
						</Link>
					</b>
				</Typography>
				<ul>
					<StyledListItem>
						At any point after a vote's inception, anyone can view
						the results of the vote within the application by
						navigating to 'View Vote Results' and entering the
						vote's application id.
					</StyledListItem>
					<StyledListItem>
						The information provided includes statistics on how many
						participants have registered/voted, how many votes each
						candidate has received, the start & end times of the
						vote, and so on.
					</StyledListItem>
					<StyledListItem>
						Additionally, links are provided to view the smart
						contract details directly on the blockchain explorer.
					</StyledListItem>
				</ul>
				<Typography variant="h6">
					<b>Github</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					Source code available{" "}
					<Link
						href="https://github.com/AdrianJendo/AlgoVote"
						target="_blank"
						underline="hover"
					>
						here
					</Link>
					.
				</Typography>
				<Typography variant="h6">
					<b>Donations</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					Donations to support the maintenance, continued development,
					and scaling of this app are more than welcome &#128522;.
				</Typography>
				<Typography sx={{ fontSize: 16 }}>
					<b>Bitcoin</b>
				</Typography>
				<CopyTextBox width={250} text={BTC_ADDR} />
				<img
					src={BTC_QR}
					alt="Err"
					height="160px"
					style={{
						padding: "5px",
					}}
				/>
				<Typography sx={{ fontSize: 16, paddingTop: "10px" }}>
					<b>Ethereum</b>
				</Typography>
				<CopyTextBox width={250} text={ETH_ADDR} />
				<img
					src={ETH_QR}
					alt="Err"
					height="160px"
					style={{
						padding: "5px",
					}}
				/>
				<Typography sx={{ fontSize: 16, paddingTop: "10px" }}>
					<b>Algorand</b>
				</Typography>
				<CopyTextBox width={250} text={ALGO_ADDR} />
				<img
					src={ALGO_QR}
					alt="Err"
					height="160px"
					style={{
						padding: "5px",
					}}
				/>
			</AboutDiv>
		</Paper>
	);
};

export default About;
