import React, { useContext } from "react";

// Review vote workflow
import { VoteResultsContext } from "context/VoteResultsContext";
import EnterAppId from "components/voteResultsWorkflow/EnterAppId";
import VoteResults from "components/voteResultsWorkflow/VoteResults";
import WorkflowDrawer from "components/base/Drawer";
import { cancelVoteResults } from "utils/misc/CancelVote";
import lookupVote from "utils/voteResultsWorkflow/LookupVote";
import { useNavigate } from "react-router-dom";

const VoteResultsWorkflow = () => {
  const [voteResults, setVoteResults] = useContext(VoteResultsContext);
  const navigate = useNavigate();

  const steps = ["Enter App Id", "Vote Information"];

  const handleNext = async () => {
    if (voteResults.activeStep === 0) {
      lookupVote(voteResults, setVoteResults);
    } else {
      cancelVoteResults(setVoteResults, navigate);
    }
  };

  const handleBack = () => {
    const activeStep = voteResults.activeStep;
    if (activeStep === 0) {
      cancelVoteResults(setVoteResults, navigate);
    } else {
      setVoteResults({
        ...voteResults,
        appId: "",
        activeStep: activeStep - 1,
      });
    }
  };

  const content = (
    <div>
      {voteResults.activeStep === 0 && (
        <EnterAppId handleNext={handleNext} handleBack={handleBack} />
      )}
      {voteResults.activeStep === 1 && (
        <VoteResults handleNext={handleNext} handleBack={handleBack} />
      )}
    </div>
  );

  return (
    <WorkflowDrawer steps={steps} stepInfo={voteResults} content={content} />
  );
};

export default VoteResultsWorkflow;
