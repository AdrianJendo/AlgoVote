import React, { useContext } from "react";
import { Button, Typography, ButtonGroup, TextField } from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
import ParticipantsTable from "components/base/RenderTable";
import {
	txtUploadHandler,
	excelUploadHandler,
} from "utils/createWorkflow/FileUpload";
import { cancelVote } from "utils/misc/CancelVote";
import {
	FillDiv,
	Input,
	buttonGroupSX,
	TableSubDiv,
	ManualUploadDiv,
	ManualUploadSubDiv,
} from "utils/Style/ParticipantsStyle";
import { typographySX } from "utils/Style/WorkflowStyle";
import ParticipantsInput from "components/createWorkflow/TextInput";
import HelpIcon from "@mui/icons-material/Help";
import HelperTooltip from "components/createWorkflow/HelperTooltip";
import { useNavigate } from "react-router-dom";

const preFundedAccountsXlsx = require("images/preFundedAccountsXlsx.png");
const preFundedAccounts = require("images/preFundedAccounts.png");

const SelectParticipants = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
	const navigate = useNavigate();

	const generateParticipants = () => {
		const participantData = {};
		for (let i = 1; i <= voteInfo.numParticipants; i++) {
			participantData[`New Account ${i}`] = 1;
		}

		setVoteInfo({
			...voteInfo,
			numNewAccounts: voteInfo.numParticipants,
			participantData,
		});
	};

	const goBack = () => {
		if (voteInfo.participantData) {
			setVoteInfo({
				...voteInfo,
				participantData: null,
				numParticipants: 0,
				numNewAccounts: 0,
			});
		} else if (voteInfo.participantUploadType) {
			setVoteInfo({
				...voteInfo,
				participantUploadType: null,
			});
		} else if (voteInfo.participantUploadMethod) {
			setVoteInfo({
				...voteInfo,
				participantUploadMethod: null,
			});
		} else if (voteInfo.accountFundingType) {
			setVoteInfo({
				...voteInfo,
				accountFundingType: null,
			});
		} else if (voteInfo.activeStep === 0) {
			cancelVote(setVoteInfo, navigate);
		}
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				Who will be participating in your vote?
			</Typography>

			{/* Select Account Type (newAccounts or preFundedAccounts) */}
			{voteInfo.accountFundingType === null && (
				<FillDiv>
					<Typography sx={typographySX(4)}>
						What accounts will be used in this vote
					</Typography>
					<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									accountFundingType: "newAccounts",
								})
							}
						>
							New Accounts
						</Button>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									accountFundingType: "preFundedAccounts",
								})
							}
						>
							Pre-funded Accounts
						</Button>
					</ButtonGroup>
				</FillDiv>
			)}

			{/* If accountFundingType === newAccounts, enter how many accounts you want to generate */}
			{voteInfo.accountFundingType === "newAccounts" &&
				voteInfo.participantData === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							How many accounts will you be funding for this vote?
						</Typography>
						<TextField
							sx={{
								marginTop: "40px",
								width: "175px",
								fontSize: "40px",
							}}
							autoFocus={true}
							value={voteInfo.numParticipants}
							placeholder="Number of participants"
							variant="standard"
							onKeyDown={(e) => {
								if (
									e.key === "Enter" &&
									voteInfo.numParticipants !== 0
								) {
									e.preventDefault();
									generateParticipants();
								} else if (e.key === "Enter") {
									alert(
										"Please enter a number greater than 0"
									);
								}
							}}
							onChange={(e) => {
								const val = e.target.value;
								if (
									val % 1 === 0 &&
									val[val.length - 1] !== "."
								) {
									setVoteInfo({
										...voteInfo,
										numParticipants:
											val === "" ? 0 : parseInt(val),
									});
								}
							}}
						/>
					</FillDiv>
				)}

			{/* If accountFundingType === preFundedAccounts AND upload method not chosen, choose upload method (file or manual) */}
			{voteInfo.accountFundingType === "preFundedAccounts" &&
				voteInfo.participantUploadMethod === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Select a method to upload existing Algorand Accounts
						</Typography>
						<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										participantUploadMethod: "file",
									})
								}
							>
								Upload A File
							</Button>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										participantUploadMethod: "manual",
									})
								}
							>
								Add Manually
							</Button>
						</ButtonGroup>
					</FillDiv>
				)}

			{/* If accountFundingType === preFundedAccounts AND upload method === file, choose file type */}
			{voteInfo.accountFundingType === "preFundedAccounts" &&
				voteInfo.participantUploadMethod === "file" &&
				voteInfo.participantUploadType === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Select a file type
						</Typography>

						<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										participantUploadType: "excel",
									})
								}
							>
								Excel File
							</Button>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										participantUploadType: "txt",
									})
								}
							>
								.txt or CSV File
							</Button>
						</ButtonGroup>
					</FillDiv>
				)}

			{/* Excel Upload */}
			{voteInfo.participantUploadType === "excel" &&
				voteInfo.participantData === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Upload a file
							<sup>
								<HelperTooltip
									title={
										<div>
											<center>
												<Typography variant="caption">
													Example of valid format
													shown below:
												</Typography>
											</center>
											<div style={{ display: "flex" }}>
												<img
													src={preFundedAccountsXlsx}
													alt="Err"
													height="160px"
													style={{
														padding: "5px",
													}}
												/>
											</div>
										</div>
									}
									placement="right"
								>
									<HelpIcon sx={{ fontSize: "16px" }} />
								</HelperTooltip>
							</sup>
						</Typography>
						<label htmlFor="file">
							<Input
								accept=".xlsx"
								id="file"
								multiple
								type="file"
								onChange={(e) =>
									excelUploadHandler(
										e,
										voteInfo,
										setVoteInfo,
										"participantData"
									)
								}
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

			{/* csv/text Upload */}
			{voteInfo.participantUploadType === "txt" &&
				voteInfo.participantData === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Upload a file
							<sup>
								<HelperTooltip
									title={
										<div>
											<center>
												<Typography variant="caption">
													Example of valid format
													shown below:
												</Typography>
											</center>
											<img
												src={preFundedAccounts}
												alt="Err"
												height="80px"
												style={{
													padding: "5px",
												}}
											/>
										</div>
									}
									placement="right"
								>
									<HelpIcon sx={{ fontSize: "16px" }} />
								</HelperTooltip>
							</sup>
						</Typography>
						<label htmlFor="file">
							<Input
								accept=".txt"
								id="file"
								multiple
								type="file"
								onChange={(e) =>
									txtUploadHandler(
										e,
										voteInfo,
										setVoteInfo,
										"participantData"
									)
								}
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

			{/* If accountFundingType === preFundedAccounts AND (upload method === manual OR upload method === file AND data already uploaded), enter participants manually */}
			{(voteInfo.participantUploadMethod === "manual" ||
				voteInfo.participantData !== null) && (
				<ManualUploadDiv>
					<ManualUploadSubDiv>
						<ParticipantsInput index="participantData" />
					</ManualUploadSubDiv>
					<TableSubDiv>
						<ParticipantsTable stage="participants" />
					</TableSubDiv>
				</ManualUploadDiv>
			)}

			{/* Reset / back button controls */}
			<ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
				{voteInfo.accountFundingType !== null && (
					<Button
						onClick={() =>
							setVoteInfo({
								...voteInfo,
								accountFundingType: null,
								participantUploadMethod: null,
								participantUploadType: null,
								participantData: null,
								numParticipants: 0,
								numNewAccounts: 0,
							})
						}
					>
						Reset
					</Button>
				)}
				<Button onClick={goBack}>
					{voteInfo.accountFundingType === null ? "Cancel" : "Back"}
				</Button>
				{voteInfo.accountFundingType === "newAccounts" &&
					voteInfo.numParticipants > 0 &&
					voteInfo.participantData === null && (
						<Button onClick={() => generateParticipants()}>
							Next
						</Button>
					)}
			</ButtonGroup>
		</div>
	);
};

export default SelectParticipants;
