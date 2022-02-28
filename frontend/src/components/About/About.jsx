import React, { useContext } from "react";
import { Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import { ParticipateContext } from "context/ParticipateContext";
import { VoteResultsContext } from "context/VoteResultsContext";
import changeRoute from "utils/misc/ChangeRoute";
import { useNavigate } from "react-router-dom";
import { StepperDiv, PaperDiv } from "utils/Style/WorkflowStyle";
import { typographySX } from "utils/Style/WorkflowStyle";

const AboutDiv = styled("div")({
	position: "relative",
	top: "5%",
	margin: "0 auto",
	width: "70%",
	alignItems: "center",
});

const StyledListItem = styled("li")({
	textAlign: "left",
	fontSize: "16px",
	marginBottom: "8px",
});

// const

const SubHeaderTypography = styled("Typography")({});

const About = () => {
	return (
		<Paper
			sx={{
				height: "100%",
				width: "100%",
				textAlign: "center",
				overflow: "auto",
			}}
		>
			<AboutDiv>
				<Typography sx={typographySX(6)} variant="h5">
					About Algo Vote
				</Typography>
				<hr />
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>DISCLAIMER</b>: <br /> THIS APP IS USING TESTNET AND
					MEANT ONLY AS A PROOF OF CONCEPT, DON'T USE MAINNET ACCOUNTS
					WHEN INTERACTING WITH IT. <br /> FOR ALL INTENSIVE PURPOSES,
					FULL VOTING PROCESSES CAN BE CREATED RELIABLY, JUST MAKE
					SURE YOU USE A TESTNET ACCOUNT. <br /> A NEW TESTNET ACCOUNT
					CAN BE **CREATED** BY CLICKING *HERE* AND **FUNDED** BY
					CLICKING *HERE*
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					This app was created as a proof of concept for how a
					decentralized voting system could work. The frontend and
					backend are both hosted in a centralized manner to provide
					convenience to the end user, but all voting logic is carried
					out using smart contracts on the algorand blockchain. Thus,
					it is possible (but much less convenient) to handle all
					aspects of the voting process by interacting directly with
					the blockchain instead of using this app.
				</Typography>
				<Typography variant="h6">
					<b>Basic Voting Workflow</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>Step 1: Create the vote</b>
				</Typography>
				<ul>
					<StyledListItem>Click 'Create Vote'</StyledListItem>
					<StyledListItem>
						Select 'New Accounts' if you want to generate new
						algorand accounts (or if you want to mix new accounts
						with existing accounts) or 'pre-funded accounts' if you
						already have accounts ready to use for this vote <br />
						<i>
							{" "}
							Note: making new accounts is more expensive because
							it's assumed that the creator will fund them all
							with the minimum algo balance required for the vote.
						</i>
					</StyledListItem>
					<StyledListItem>
						Add candidates for the vote, either by uploaded a csv or
						excel file, or entering them manually
					</StyledListItem>
					<StyledListItem>
						Enter a start date & time for the vote (must start at
						some date into the future)
					</StyledListItem>
					<StyledListItem>
						Enter an end date & time for the vote
					</StyledListItem>
					<StyledListItem>
						After, reviewing the details, paste the secret key of
						the account that will be used to fund the vote (creating
						smart contracts & voting token, and funding any new
						accounts)
					</StyledListItem>
					<StyledListItem>
						If the transactions are successful, a link will appear
						to view the smart contract on the blockchain and an
						excel file with all the vote details will be created
					</StyledListItem>
				</ul>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>Step 2: Participate in the vote</b>
				</Typography>
				<ul>
					<StyledListItem>
						Any prefunded accounts must register to participate in
						the vote (registration MUST HAPPEN before the start date
						& time of the vote)
						<br />
						<i>
							Note: new accounts are automatically opted into the
							vote when the vote is created
						</i>
					</StyledListItem>
					<StyledListItem>
						Once the vote begins, all participants can use tohe
						'Voting' workflow to select their candidate of choice
						and cast their vote
					</StyledListItem>
				</ul>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					<b>Step 3: View the vote results</b>
				</Typography>
				<ul>
					<StyledListItem>
						At any point after a vote's inception, anyone can view
						the results of the vote within the application by
						navigating to 'View Vote Results' and entering the
						vote's application id
					</StyledListItem>
					<StyledListItem>
						The information provided includes statistics on how many
						participants have registered/voted, how many votes each
						candidate has received, the total number of votes
						eligibile to be cast, and the start and end times of the
						vote
					</StyledListItem>
					<StyledListItem>
						Additionally, links are provided to view the smart
						contract details directly on the blockchain explorer
					</StyledListItem>
				</ul>
				<Typography variant="h6">
					<b>Github</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					Source code available at LINK
				</Typography>
				<Typography variant="h6">
					<b>Donations</b>
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					Donations to support the maintenance, continued development,
					and scaling of this app are more than welcome
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					BTC:
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					ETH:
				</Typography>
				<Typography paragraph={true} sx={{ fontSize: 16 }}>
					ALGO:
				</Typography>

				<br />
			</AboutDiv>
		</Paper>
	);
};

export default About;
