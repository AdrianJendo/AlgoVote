import React, { useContext } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import StickyHeadTable from "components/RenderTable";
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

const SelectCandidates = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	const goBack = () => {
		if (voteInfo.candidateData) {
			setVoteInfo({ ...voteInfo, candidateData: null });
		} else if (voteInfo.candidateUploadType) {
			setVoteInfo({ ...voteInfo, candidateUploadType: null });
		} else if (voteInfo.candidateMethod) {
			setVoteInfo({ ...voteInfo, candidateMethod: null });
		} else {
			setVoteInfo({ ...voteInfo, activeStep: voteInfo.activeStep - 1 });
		}
	};

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				What will be the choices for your vote?
			</Typography>

			{voteInfo.candidateMethod === null && (
				<FillDiv>
					<Typography sx={typographySX(4)}>
						Select a method to add candidates
					</Typography>
					<ButtonGroup variant="contained" sx={buttonGroupSX(10)}>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									candidateMethod: "file",
								})
							}
						>
							Upload A File
						</Button>
						<Button
							onClick={() =>
								setVoteInfo({
									...voteInfo,
									candidateMethod: "manual",
								})
							}
						>
							Add Manually
						</Button>
					</ButtonGroup>
				</FillDiv>
			)}
			{voteInfo.candidateMethod === "file" &&
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
			{voteInfo.candidateMethod === "manual" && (
				<FillDiv>Corvette</FillDiv>
			)}
			{voteInfo.candidateUploadType === "excel" &&
				voteInfo.candidateData === null && (
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
			{voteInfo.candidateData !== null && (
				<div
					style={{
						position: "relative",
						height: "calc(100% - 180px)",
						width: "60%",
						left: "20%",
						top: "5%",
					}}
				>
					<StickyHeadTable stage="candidates" />
				</div>
			)}
			<ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
				{voteInfo.candidateFormat !== null && (
					<Button
						onClick={() =>
							setVoteInfo({
								...voteInfo,
								candidateMethod: null,
								candidateUploadType: null,
								candidateData: null,
							})
						}
					>
						Reset
					</Button>
				)}
				<Button onClick={goBack}>Go Back</Button>
			</ButtonGroup>
		</div>
	);
};

export default SelectCandidates;
