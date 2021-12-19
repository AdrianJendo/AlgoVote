import React, { useContext, useState } from "react";
import { Button, Paper, Typography, ButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import VerticalLinearStepper from "components/Stepper";

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

	//Handle file upload
	const [participantData, setParticipantData] = useState(null);
	const [fileName, setFileName] = useState(null);

	// Handle .txt and .csv files
	const fileUploadHandler = (e) => {
		const file = e.target.files[0];
		let fileReader = new FileReader();
		try {
			fileReader.readAsText(file);
			setFileName(file.name);
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
			let i = 0;
			while (i < content.length) {
				if (content[i] === "" || !content[i].includes("@")) {
					content.splice(i, 1);
				} else {
					i++;
				}
			}

			setParticipantData(content);
		};
	};

	const goBack = () => {
		if (voteInfo.uploadType) {
			setVoteInfo({ ...voteInfo, uploadType: null });
		} else if (voteInfo.method) {
			setVoteInfo({ ...voteInfo, method: null });
		} else if (voteInfo.format) {
			setVoteInfo({ ...voteInfo, format: null });
		} else {
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
						{voteInfo.uploadType === "excel" && (
							<FillDiv>
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
						{voteInfo.uploadType === "txt" && (
							<FillDiv>
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
						<Button
							sx={buttonGroupSX(75)}
							variant="contained"
							onClick={goBack}
						>
							Go Back
						</Button>
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
