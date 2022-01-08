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

const candidates1 = require("images/candidates1.png");
const candidates2 = require("images/candidates2.png");

const SelectCandidates = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	const goBack = () => {
		if (
			voteInfo.candidateData &&
			voteInfo.candidateUploadMethod === "manual"
		) {
			setVoteInfo({
				...voteInfo,
				candidateData: null,
				candidateUploadMethod: null,
			});
		} else if (voteInfo.candidateData) {
			setVoteInfo({ ...voteInfo, candidateData: null });
		} else if (voteInfo.candidateUploadType) {
			setVoteInfo({ ...voteInfo, candidateUploadType: null });
		} else if (voteInfo.candidateUploadMethod) {
			setVoteInfo({ ...voteInfo, candidateUploadMethod: null });
		} else {
			setVoteInfo({ ...voteInfo, activeStep: voteInfo.activeStep - 1 });
		}
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				What will be the choices for your vote?
			</Typography>

			{voteInfo.candidateUploadMethod === null && (
				<FillDiv>
					<Typography sx={typographySX(4)}>
						Select a method to add candidates
					</Typography>
					<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									candidateUploadMethod: "file",
								})
							}
						>
							Upload A File
						</Button>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									candidateUploadMethod: "manual",
								})
							}
						>
							Add Manually
						</Button>
					</ButtonGroup>
				</FillDiv>
			)}
			{voteInfo.candidateUploadMethod === "file" &&
				voteInfo.candidateUploadType === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Select a file type
						</Typography>

						<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										candidateUploadType: "excel",
									})
								}
							>
								Excel File
							</Button>
							<Button
								onClick={() =>
									setVoteInfo({
										...voteInfo,
										candidateUploadType: "txt",
									})
								}
							>
								.txt or CSV File
							</Button>
						</ButtonGroup>
					</FillDiv>
				)}
			{voteInfo.candidateUploadType === "excel" &&
				voteInfo.candidateData === null && (
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
												src={candidates1}
												alt="Err"
												height="200px"
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
								accept=".xlsx"
								id="file"
								multiple
								type="file"
								onChange={(e) =>
									excelUploadHandler(
										e,
										voteInfo,
										setVoteInfo,
										"candidateData"
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
			{voteInfo.candidateUploadType === "txt" &&
				voteInfo.candidateData === null && (
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
												src={candidates2}
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
										"candidateData"
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
			{(voteInfo.candidateUploadMethod === "manual" ||
				voteInfo.candidateData !== null) && (
				<ManualUploadDiv>
					<ManualUploadSubDiv>
						<CustomizedInputBase index="candidateData" />
					</ManualUploadSubDiv>
					<TableSubDiv>
						<StickyHeadTable stage="candidates" />
					</TableSubDiv>
				</ManualUploadDiv>
			)}
			<ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
				{voteInfo.candidateUploadMethod !== null &&
					voteInfo.candidateUploadMethod !== "manual" && (
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									candidateUploadMethod: null,
									candidateUploadType: null,
									candidateData: null,
								})
							}
						>
							Reset
						</Button>
					)}
				<Button onClick={goBack}>Back</Button>
			</ButtonGroup>
		</div>
	);
};

export default SelectCandidates;
