import React, { useContext } from "react";

// Paricipate workflow
import { ParticipateContext } from "context/ParticipateContext";
import ReviewAndPay from "components/participateWorkflow/ReviewAndPay";
import SelectCandidate from "components/participateWorkflow/SelectCandidate";
import EnterVoteInfo from "components/participateWorkflow/EnterVoteInfo";
import RegisterOrVote from "components/participateWorkflow/RegisterOrVote";
import WorkflowDrawer from "components/base/Drawer";
import { cancelParticipate } from "utils/misc/CancelVote";
import lookupVote from "utils/participateWorkflow/LookupVote";
import { useNavigate } from "react-router-dom";

const ParticipateWorkflow = () => {
  const [participateInfo, setParticipateInfo] = useContext(ParticipateContext);
  const navigate = useNavigate();

  const steps = ["Register or vote", "Enter vote information"];

  if (participateInfo.registerOrVote === "vote") {
    steps.push("Choose your candidate");
  }

  steps.push("Review & Pay");

  const handleNext = async () => {
    if (participateInfo.activeStep === 1) {
      lookupVote(participateInfo, setParticipateInfo);
    } else if (
      participateInfo.activeStep === 3 ||
      (participateInfo.activeStep === 2 &&
        participateInfo.registerOrVote === "register")
    ) {
      cancelParticipate(setParticipateInfo, navigate);
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
      cancelParticipate(setParticipateInfo, navigate);
    } else if (activeStep === 1) {
      setParticipateInfo({
        ...participateInfo,
        registerOrVote: null,
        activeStep: activeStep - 1,
      });
    } else {
      setParticipateInfo({
        ...participateInfo,
        activeStep: activeStep - 1,
      });
    }
  };

  const content = (
    <div>
      {participateInfo.activeStep === 0 && (
        <RegisterOrVote handleNext={handleNext} handleBack={handleBack} />
      )}
      {participateInfo.activeStep === 1 && (
        <EnterVoteInfo handleNext={handleNext} handleBack={handleBack} />
      )}
      {participateInfo.activeStep === 2 &&
        participateInfo.registerOrVote === "vote" && (
          <SelectCandidate handleNext={handleNext} handleBack={handleBack} />
        )}
      {(participateInfo.activeStep === 3 ||
        (participateInfo.activeStep === 2 &&
          participateInfo.registerOrVote === "register")) && (
        <ReviewAndPay handleBack={handleBack} />
      )}
    </div>
  );

  return (
    <WorkflowDrawer
      steps={steps}
      stepInfo={participateInfo}
      content={content}
    />
  );
};

export default ParticipateWorkflow;
