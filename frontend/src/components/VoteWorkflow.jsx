import React, { useContext, useState } from "react";
import { Button, Paper, Typography, ButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import VerticalLinearStepper from "components/Stepper";
import StickyHeadTable from "components/ParticpantsTable";

const ButtonDiv = styled("div")(
	() => `
		position: absolute;
		left: 50%;
		top: 20%;
	`
);

const StepperDiv = styled("div")(
	() => `
		position:absolute;
		left: 2%;
		top: 80px;
	`
);

const PaperDiv = styled("div")(
	({ theme }) => `
		height: 100%;
		width: 100%;
		background: ${theme.palette.background.default};
	`
);

const FillDiv = styled("div")(
	() => `
		position:relative;
		top:30px
	`
);

const Input = styled("input")({
	display: "none",
});

const typographySX = (top) => ({ position: "relative", top: `${top}%` });
const buttonGroupSX = (top) => ({ position: "relative", top: `${top}px` });

const VoteWorkflow = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	// Handle .txt and .csv files
	const fileUploadHandler = (e) => {
		const participants = {}; // handling multiple votes right now, but update it in the future to support name:numVotes in the future ... for excel files just do adjacent cells
		const len = e.target.files.length;
		for (let i = 0; i < len; i++) {
			const file = e.target.files[i];
			let fileReader = new FileReader();
			try {
				fileReader.readAsText(file);
			} catch {}
			fileReader.onloadend = (e) => {
				const content = e.target.result
					.split("\n")
					.join(",")
					.split("\r")
					.join(",")
					.split(" ")
					.join(",")
					.split(","); // Split element in list of values
				for (let i = 0; i < content.length; i++) {
					if (content[i] !== "" && content[i].includes("@")) {
						if (participants[content[i]]) {
							participants[content[i]]++;
						} else {
							participants[content[i]] = 1;
						}
					}
				}
				if (i === len - 1) {
					setVoteInfo({ ...voteInfo, participantData: participants });
				}
			};
		}
	};

	const goBack = () => {
		if (voteInfo.participantData) {
			setVoteInfo({ ...voteInfo, participantData: null });
		} else if (voteInfo.uploadType) {
			setVoteInfo({ ...voteInfo, uploadType: null });
		} else if (voteInfo.method) {
			setVoteInfo({ ...voteInfo, method: null });
		} else if (voteInfo.format) {
			setVoteInfo({ ...voteInfo, format: null });
		} else if (voteInfo.voteStarted) {
			setVoteInfo({ ...voteInfo, voteStarted: false });
		}
	};

	return (
		<div style={{ height: "100%" }}>
			{voteInfo.voteStarted && (
				<StepperDiv>
					<VerticalLinearStepper />
				</StepperDiv>
			)}
			{voteInfo.voteStarted ? (
				<PaperDiv>
					<Paper
						sx={{
							position: "relative",
							height: "100%",
							width: "80%",
							left: "20%",
							textAlign: "center",
						}}
					>
						<Typography sx={typographySX(2)} variant="h5">
							Who will be participating in your vote?
						</Typography>

						{voteInfo.format === null && (
							<FillDiv>
								<Typography sx={typographySX(4)}>
									How will your participants be identified for
									this vote?
								</Typography>
								<ButtonGroup
									variant="contained"
									sx={buttonGroupSX(10)}
								>
									<Button
										onClick={() =>
											setVoteInfo({
												...voteInfo,
												format: "email",
											})
										}
									>
										Email
									</Button>
									<Button
										onClick={() =>
											setVoteInfo({
												...voteInfo,
												format: "phone",
											})
										}
									>
										Phone Number
									</Button>
									<Button
										onClick={() =>
											setVoteInfo({
												...voteInfo,
												format: "singleID",
											})
										}
									>
										ID Number
									</Button>
									<Button
										onClick={() =>
											setVoteInfo({
												...voteInfo,
												format: "keyValuePair",
											})
										}
									>
										Key-Value Pair
									</Button>
								</ButtonGroup>
							</FillDiv>
						)}

						{voteInfo.format !== null && voteInfo.method === null && (
							<FillDiv>
								<Typography sx={typographySX(4)}>
									Select a method to add participants
								</Typography>
								<ButtonGroup
									variant="contained"
									sx={buttonGroupSX(10)}
								>
									<Button
										onClick={() =>
											setVoteInfo({
												...voteInfo,
												method: "file",
											})
										}
									>
										Upload File
									</Button>
									<Button
										onClick={() =>
											setVoteInfo({
												...voteInfo,
												method: "manual",
											})
										}
									>
										Add Manually
									</Button>
								</ButtonGroup>
							</FillDiv>
						)}
						{voteInfo.method === "file" &&
							voteInfo.uploadType === null && (
								<FillDiv>
									<Typography sx={typographySX(4)}>
										Select a file type
									</Typography>

									<ButtonGroup
										variant="contained"
										sx={buttonGroupSX(10)}
									>
										<Button
											onClick={() =>
												setVoteInfo({
													...voteInfo,
													uploadType: "excel",
												})
											}
										>
											Excel File
										</Button>
										<Button
											onClick={() =>
												setVoteInfo({
													...voteInfo,
													uploadType: "txt",
												})
											}
										>
											.txt or CSV File
										</Button>
									</ButtonGroup>
								</FillDiv>
							)}
						{voteInfo.method === "manual" && (
							<FillDiv>Corvette</FillDiv>
						)}
						{voteInfo.uploadType === "excel" &&
							voteInfo.participantData === null && (
								<FillDiv>
									<Typography sx={typographySX(4)}>
										Upload a file [USE TOOLTIP HERE THAT
										SPECIFIES FORMAT]
									</Typography>
									<label htmlFor="file">
										<Input
											accept=".xlsx"
											id="file"
											multiple
											type="file"
										/>
										<Button
											sx={buttonGroupSX(10)}
											variant="contained"
											component="span"
										>
											Upload File
										</Button>
									</label>
								</FillDiv>
							)}
						{voteInfo.uploadType === "txt" &&
							voteInfo.participantData === null && (
								<FillDiv>
									<Typography sx={typographySX(4)}>
										Upload a file [USE TOOLTIP HERE THAT
										SPECIFIES FORMAT]
									</Typography>
									<label htmlFor="file">
										<Input
											accept=".txt"
											id="file"
											multiple
											type="file"
											onChange={fileUploadHandler}
										/>
										<Button
											sx={buttonGroupSX(10)}
											variant="contained"
											component="span"
										>
											Upload File
										</Button>
									</label>
								</FillDiv>
							)}
						{voteInfo.participantData !== null && (
							<div
								style={{
									position: "relative",
									height: "calc(100% - 180px)",
									width: "60%",
									left: "20%",
									top: "5%",
								}}
							>
								<StickyHeadTable />
							</div>
						)}
						<ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
							<Button onClick={goBack}>
								{voteInfo.format == null ? "Cancel" : "Go Back"}
							</Button>
							{voteInfo.participantData !== null && (
								<Button>Confirm</Button>
							)}
						</ButtonGroup>
					</Paper>
				</PaperDiv>
			) : (
				<ButtonDiv>
					<Button
						variant="contained"
						onClick={() =>
							setVoteInfo({ ...voteInfo, voteStarted: true })
						}
					>
						Create vote
					</Button>
				</ButtonDiv>
			)}
		</div>
	);
};

export default VoteWorkflow;
