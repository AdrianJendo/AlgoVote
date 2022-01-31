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

const StepIcon = (props) => {
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
};

const WorkflowStepper = (props) => {
	const { steps, stepInfo, handleNext, readyToContinue, handleBack } = props;

	return (
		<Box sx={{ maxWidth: 300 }}>
			<Stepper activeStep={stepInfo.activeStep} orientation="vertical">
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
										variant="text"
										onClick={handleBack}
										disabled={
											stepInfo.voteSubmitted === true
										}
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
};

export default WorkflowStepper;
