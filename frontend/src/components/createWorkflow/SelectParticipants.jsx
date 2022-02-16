import React, { useContext } from "react";
import { Button, Typography, ButtonGroup, TextField } from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
import StickyHeadTable from "components/base/RenderTable";
import { txtUploadHandler, excelUploadHandler } from "utils/FileUpload";
import { cancelVote } from "utils/CancelVote";
import { generateAlgorandAccounts } from "utils/AlgoFunctions";
import {
	FillDiv,
	Input,
	typographySX,
	buttonGroupSX,
	TableSubDiv,
	ManualUploadDiv,
	ManualUploadSubDiv,
} from "utils/Style/ParticipantsStyle";
import CustomizedInputBase from "components/createWorkflow/TextInput";
import HelpIcon from "@mui/icons-material/Help";
import HelperTooltip from "components/createWorkflow/HelperTooltip";
import { useNavigate } from "react-router-dom";

// const emails1 = require("images/emails1.png");
// const emails2 = require("images/emails2.png");
// const emails3 = require("images/emails3.png");
// const phoneNumbers1 = require("images/phoneNumbers1.png");
// const phoneNumbers2 = require("images/phoneNumbers2.png");
// const phoneNumbers3 = require("images/phoneNumbers3.png");
const preFundedAccountsXlsx = require("images/preFundedAccountsXlsx.png");
const preFundedAccounts = require("images/preFundedAccounts.png");

const SelectParticipants = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
	const navigate = useNavigate();

	const goBack = () => {
		if (voteInfo.participantData) {
			setVoteInfo({
				...voteInfo,
				participantData: null,
				numAccounts: 0,
				privatePublicKeyPairs: null,
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
							value={voteInfo.numAccounts}
							placeholder="Number of participants"
							variant="standard"
							onChange={(e) => {
								const val = e.target.value;
								if (
									val % 1 === 0 &&
									val[val.length - 1] !== "."
								) {
									setVoteInfo({
										...voteInfo,
										numAccounts:
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
						<CustomizedInputBase index="participantData" />
					</ManualUploadSubDiv>
					<TableSubDiv>
						<StickyHeadTable stage="participants" />
					</TableSubDiv>
				</ManualUploadDiv>
			)}

			{/* TEMP : option to send notification to participants*/}
			{/* {voteInfo.accountFundingType === "preFundedAccounts" &&
				voteInfo.contactParticipantMethod === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							How will users be notified of this vote?
						</Typography>
						<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										contactParticipantMethod: "email",
									})
								}
							>
								Email
							</Button>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										contactParticipantMethod: "phone",
									})
								}
							>
								Phone Number
							</Button>
						</ButtonGroup>
					</FillDiv>
				)} */}

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
								privatePublicKeyPairs: null,
								numAccounts: 0,
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
					voteInfo.numAccounts > 0 &&
					voteInfo.participantData === null && (
						<Button
							onClick={() =>
								generateAlgorandAccounts(voteInfo.numAccounts)
									.then((accounts) => {
										// save accounts
										const participantData = {};
										const privatePublicKeyPairs = {};
										for (
											let i = 0;
											i < accounts.length;
											i++
										) {
											privatePublicKeyPairs[
												accounts[i].accountAddr
											] = accounts[i].accountMnemonic;
											participantData[
												accounts[i].accountAddr
											] = 1;
										}

										setVoteInfo({
											...voteInfo,
											participantData,
											privatePublicKeyPairs,
										});
									})
									.catch((err) => {
										console.log(err);
									})
							}
						>
							Next
						</Button>
					)}
			</ButtonGroup>
		</div>
	);
};

export default SelectParticipants;
