import * as React from "react";
import {
	Box,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Typography,
} from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/CancelVote";
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
	const [participateInfo, setParticipateInfo] =
		React.useContext(ParticipateContext);
	const [readyToContinue, setReadyToContinue] = React.useState(false);

	React.useEffect(() => {
		if (true) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [participateInfo]);

	const handleNext = () => {
		if (false) {
		} else if (participateInfo.activeStep === 5) {
			cancelParticipate(setParticipateInfo);
		} else {
			setParticipateInfo({
				...participateInfo,
				activeStep: participateInfo.activeStep + 1,
			});
		}
	};

	const handleBack = () => {
		const activeStep = participateInfo.activeStep;
		if (activeStep === 0) {
			//cancelling
			cancelParticipate(setParticipateInfo);
		} else {
			setParticipateInfo({
				...participateInfo,
				activeStep: activeStep - 1,
			});
		}
	};

	return (
		<Box sx={{ maxWidth: 300 }}>
			<Stepper
				activeStep={participateInfo.activeStep}
				orientation="vertical"
			>
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
										disabled={participateInfo.voteCreated}
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
		</Box>
	);
}
