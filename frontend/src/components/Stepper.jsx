import * as React from "react";
import {
	Box,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Paper,
	Typography,
} from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
import { DateValueContext } from "context/DateValueContext";
import { delay } from "utils/Constants";
import isSameDate from "utils/IsSameDate";
import { styled } from "@mui/system";
import Check from "@mui/icons-material/Check";

const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
	color: theme.palette.primary.main,

	"& .background": {
		width: 24,
		height: 24,
		borderRadius: "50%",
		color: "#fff",
		backgroundColor:
			ownerState.active || ownerState.completed
				? theme.palette.primary.main
				: theme.stepperButtonColor,
	},
}));

function StepIcon(props) {
	const { active, completed, icon, className } = props;
	return (
		<StepIconRoot ownerState={{ active, completed }} className={className}>
			{completed ? (
				// <div className="background">
				// 	<Check sx={{ fontSize: 20 }} />
				// </div>
				<Check />
			) : (
				<div className="background">
					<div className="icon">
						<Typography
							sx={{
								fontSize: "12px",
								transform: "translate(8.5px, 3px)",
							}}
						>
							{icon}
						</Typography>
					</div>
				</div>
			)}
		</StepIconRoot>
	);
}

const steps = [
	{
		label: "Select Voting Participants",
		description: `Select who will be participating in your vote.`,
	},
	{
		label: "Specify Vote Options",
		description: "Select the possible candidates for the vote.",
	},
	{
		label: "Specify Start Date",
		description: `Choose when your vote will start.`,
	},
	{
		label: "Specify End Date",
		description: `Choose when your vote will end.`,
	},
	{
		label: "Review Details",
		description: `Review the details of this transaction and click 'Continue'.`,
	},
	{
		label: "Payment",
		description: `A gas fee of X algo is required to execute this smart contract on the blockchain. Make the payment to finalize this vote contract.`,
	},
];

export default function VerticalLinearStepper() {
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);
	const dateValue = React.useContext(DateValueContext)[0];
	const [readyToContinue, setReadyToContinue] = React.useState(false);

	React.useEffect(() => {
		if (
			voteInfo.activeStep === 0 || //&& voteInfo.participantData) ||
			voteInfo.activeStep === 1 || //&& !dateValue.error) ||
			(voteInfo.activeStep === 2 && !dateValue.error) ||
			(voteInfo.activeStep === 3 && !dateValue.error) ||
			voteInfo.activeStep === 4
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [voteInfo, dateValue]);

	const handleNext = () => {
		if (voteInfo.activeStep === 2) {
			// Start date stuff
			if (
				!isSameDate(dateValue.value, new Date()) ||
				dateValue.timeValue - new Date(new Date().getTime() + delay) > 0
			) {
				setVoteInfo({
					...voteInfo,
					activeStep: voteInfo.activeStep + 1,
					startDate: dateValue.value,
					startTime: new Date(dateValue.timeValue.setSeconds(0)),
				});
			} else {
				alert("Update start time or date to be after current time");
			}
		} else if (voteInfo.activeStep === 3) {
			// End date stuff
			if (
				(isSameDate(dateValue.value, new Date()) &&
					(dateValue.timeValue -
						new Date(new Date().getTime() + delay) <
						0 ||
						dateValue.timeValue -
							new Date(voteInfo.startTime.getTime() + delay) <
							0)) || // check if the date is today and we are choosing a time in the past or too early
				(isSameDate(dateValue.value, voteInfo.startDate) &&
					dateValue.timeValue -
						new Date(voteInfo.startTime.getTime() + delay) <
						0)
			) {
				alert(
					"Update end time or date to be after current time + delay"
				);
			} else {
				setVoteInfo({
					...voteInfo,
					activeStep: voteInfo.activeStep + 1,
					endDate: dateValue.value,
					endTime: new Date(dateValue.timeValue.setSeconds(0)),
				});
			}
		} else {
			setVoteInfo({
				...voteInfo,
				activeStep: voteInfo.activeStep + 1,
			});
		}
	};

	const handleBack = () => {
		const activeStep = voteInfo.activeStep;
		if (activeStep === 0) {
			//cancelling
			setVoteInfo({
				...voteInfo,
				voteStarted: false,
				participantFormat: null,
				participantMethod: null,
				participantUploadType: null,
				candidateFormat: null,
				candidateMethod: null,
				candidateUploadType: null,
				participantData: null,
				candidateData: null,
				startDate: null,
				endDate: null,
				paymentReceived: false,
				confirmed: false,
			});
		} else {
			setVoteInfo({ ...voteInfo, activeStep: activeStep - 1 });
		}
	};

	const handleReset = () => {
		setVoteInfo({ ...voteInfo, activeStep: 0 });
	};

	return (
		<Box sx={{ maxWidth: 300 }}>
			<Stepper activeStep={voteInfo.activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepLabel
							optional={
								index === steps.length - 1 ? (
									<Typography variant="caption">
										Last step
									</Typography>
								) : null
							}
							StepIconComponent={StepIcon}
						>
							{step.label}
						</StepLabel>
						<StepContent>
							<Typography>{step.description}</Typography>
							<Box sx={{ mb: 2 }}>
								<div>
									<Button
										variant="contained"
										onClick={handleNext}
										sx={{ mt: 1, mr: 1 }}
										disabled={!readyToContinue}
									>
										{index === steps.length - 1
											? "Finish"
											: "Continue"}
									</Button>

									<Button
										// disabled={index === 0}
										variant="text"
										onClick={handleBack}
										sx={{ mt: 1, mr: 1 }}
									>
										{index > 0 ? "Back" : "Cancel"}
									</Button>
								</div>
							</Box>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{voteInfo.activeStep === steps.length && (
				<Paper square elevation={0} sx={{ p: 3 }}>
					<Typography>
						All steps completed - you&apos;re finished
					</Typography>
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Reset - temp
					</Button>
				</Paper>
			)}
		</Box>
	);
}
