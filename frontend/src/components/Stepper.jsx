import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { VoteInfoContext } from "context/VoteInfoContext";
import { DateValueContext } from "context/DateValueContext";

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

const delay = 60 * 5000; // minutes (use delay of 5 minutes)

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
			(voteInfo.activeStep === 4 && voteInfo.paymentReceived)
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [voteInfo, dateValue]);

	const handleNext = () => {
		if (voteInfo.activeStep === 2) {
			if (
				dateValue.timeValue < new Date(new Date().getTime()) ||
				dateValue.startDate <
					new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						new Date().getDate()
					)
			) {
				alert("Update start time or date to be after current time");
			} else {
				setVoteInfo({
					...voteInfo,
					activeStep: voteInfo.activeStep + 1,
					startDate: dateValue.value,
					startTime: new Date(dateValue.timeValue.setSeconds(0)),
				});
			}
		} else if (voteInfo.activeStep === 3) {
			if (
				dateValue.timeValue < new Date(new Date().getTime() + delay) ||
				dateValue.endDate <
					new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						new Date().getDate()
					)
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
