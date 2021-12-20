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
		label: "Payment",
		description: `A gas fee of X algo is required to execute this smart contract on the blockchain.`,
	},
	{
		label: "Confirm",
		description: `Review the details of this transaction and click 'Finish'.`,
	},
];

export default function VerticalLinearStepper() {
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);
	const [readyToContinue, setReadyToContinue] = React.useState(false);

	React.useEffect(() => {
		if (
			(voteInfo.activeStep === 0 && voteInfo.participantData) ||
			(voteInfo.activeStep === 1 && voteInfo.candidateDate) ||
			(voteInfo.activeStep === 2 && voteInfo.startDate) ||
			(voteInfo.activeStep === 3 && voteInfo.endDate) ||
			(voteInfo.activeStep === 4 && voteInfo.paymentReceived)
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [voteInfo]);

	const handleNext = () => {
		setVoteInfo({
			...voteInfo,
			activeStep: voteInfo.activeStep + 1,
		});
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
			// if (activeStep === 1) {
			// 	// newVoteInfo.candidateData = null;
			// } else if (activeStep === 2) {
			// }
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
								index === 2 ? (
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
