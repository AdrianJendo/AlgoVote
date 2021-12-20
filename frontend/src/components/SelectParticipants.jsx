import React, { useContext } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import StickyHeadTable from "components/ParticpantsTable";
import { txtUploadHandler, excelUploadHandler } from "utils/FileUpload";

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

const SelectParticipants = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	const goBack = () => {
		if (voteInfo.participantData) {
			setVoteInfo({ ...voteInfo, participantData: null });
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
						<Button
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
						</Button>
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
										participantMethod: "file",
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
			{voteInfo.participantMethod === "file" &&
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
			{voteInfo.participantMethod === "manual" && (
				<FillDiv>Corvette</FillDiv>
			)}
			{voteInfo.participantUploadType === "excel" &&
				voteInfo.participantData === null && (
					<FillDiv>
						<Typography sx={typographySX(4)}>
							Upload a file [USE TOOLTIP HERE THAT SPECIFIES
							FORMAT]
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
							Upload a file [USE TOOLTIP HERE THAT SPECIFIES
							FORMAT]
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
