import React, { useContext } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
import StickyHeadTable from "components/RenderTable";
import { txtUploadHandler, excelUploadHandler } from "utils/FileUpload";
import {
	FillDiv,
	Input,
	typographySX,
	buttonGroupSX,
	TableSubDiv,
	ManualUploadDiv,
	ManualUploadSubDiv,
} from "utils/ParticipantsStyle";
import CustomizedInputBase from "components/TextInput";
import HelpIcon from "@mui/icons-material/Help";
import HelperTooltip from "components/HelperTooltip";

const emails1 = require("images/emails1.png");
const emails2 = require("images/emails2.png");
const emails3 = require("images/emails3.png");
const phoneNumbers1 = require("images/phoneNumbers1.png");
const phoneNumbers2 = require("images/phoneNumbers2.png");
const phoneNumbers3 = require("images/phoneNumbers3.png");

const SelectParticipants = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	const goBack = () => {
		if (
			voteInfo.participantData &&
			voteInfo.participantMethod === "upload"
		) {
			setVoteInfo({ ...voteInfo, participantData: null });
		} else if (
			voteInfo.participantData &&
			voteInfo.participantMethod === "manual"
		) {
			setVoteInfo({
				...voteInfo,
				participantMethod: null,
				participantData: null,
			});
		} else if (voteInfo.participantUploadType) {
			setVoteInfo({ ...voteInfo, participantUploadType: null });
		} else if (voteInfo.participantMethod) {
			setVoteInfo({ ...voteInfo, participantMethod: null });
		} else if (voteInfo.participantFormat) {
			setVoteInfo({ ...voteInfo, participantFormat: null });
		} else if (voteInfo.voteStarted) {
			setVoteInfo({ ...voteInfo, voteStarted: false });
		}
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				Who will be participating in your vote?
			</Typography>

			{voteInfo.participantFormat === null && (
				<FillDiv>
					<Typography sx={typographySX(4)}>
						How will your participants be identified for this vote?
					</Typography>
					<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									participantFormat: "email",
								})
							}
						>
							Email
						</Button>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									participantFormat: "phone",
								})
							}
						>
							Phone Number
						</Button>
						{/* <Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									participantFormat: "singleID",
								})
							}
						>
							ID Number
						</Button>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									participantFormat: "keyValuePair",
								})
							}
						>
							Key-Value Pair
						</Button> */}
					</ButtonGroup>
				</FillDiv>
			)}

			{voteInfo.participantFormat !== null &&
				voteInfo.participantMethod === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Select a method to add participants
						</Typography>
						<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										participantMethod: "upload",
									})
								}
							>
								Upload A File
							</Button>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										participantMethod: "manual",
									})
								}
							>
								Add Manually
							</Button>
						</ButtonGroup>
					</FillDiv>
				)}
			{voteInfo.participantMethod === "upload" &&
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
			{voteInfo.participantUploadType === "excel" &&
				voteInfo.participantData === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Upload a file{" "}
							<sup>
								<HelperTooltip
									title={
										<div>
											<center>
												<Typography variant="caption">
													Examples of valid formats
													are shown below:
												</Typography>
											</center>
											<div style={{ display: "flex" }}>
												<img
													src={
														voteInfo.participantFormat ===
														"email"
															? emails1
															: phoneNumbers1
													}
													alt="Err"
													height="160px"
													style={{
														padding: "5px",
													}}
												/>
												<img
													src={
														voteInfo.participantFormat ===
														"email"
															? emails2
															: phoneNumbers2
													}
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
			{voteInfo.participantUploadType === "txt" &&
				voteInfo.participantData === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Upload a file{" "}
							<sup>
								<HelperTooltip
									title={
										<div>
											<center>
												<Typography variant="caption">
													An example of a valid format
													is shown below:
												</Typography>
											</center>
											<img
												src={
													voteInfo.participantFormat ===
													"email"
														? emails3
														: phoneNumbers3
												}
												alt="Err"
												height="100px"
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
			{(voteInfo.participantMethod === "manual" ||
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
			<ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
				{voteInfo.participantFormat !== null && (
					<Button
						onClick={() =>
							setVoteInfo({
								...voteInfo,
								participantFormat: null,
								participantMethod: null,
								participantUploadType: null,
								participantData: null,
							})
						}
					>
						Reset
					</Button>
				)}
				<Button onClick={goBack}>
					{voteInfo.participantFormat == null ? "Cancel" : "Go Back"}
				</Button>
			</ButtonGroup>
		</div>
	);
};

export default SelectParticipants;
