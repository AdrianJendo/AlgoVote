import React, { useContext, useState } from "react";

// Create workflow
import { VoteInfoContext } from "context/VoteInfoContext";
import SelectParticipants from "components/createWorkflow/SelectParticipants";
import SelectCandidates from "components/createWorkflow/SelectCandidates";
import DatePicker from "components/createWorkflow/DatePicker";
import ReviewDetails from "components/createWorkflow/ReviewDetails";
import Payment from "components/createWorkflow/Payment";

import { MINUTES_DELAY, DELAY } from "constants";
import isSameDate from "utils/createWorkflow/IsSameDate";

import WorkflowDrawer from "components/base/Drawer";

const CreateVoteWorkflow = () => {
  const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
  const [dateValue, setDateValue] = useState(null);

  const steps = [
    "Select Voting Participants",
    "Specify Vote Options",
    "Specify Start Date",
    "Specify End Date",
    "Review Details",
    "Payment & Title",
  ];

  const handleNext = () => {
    // Start date
    if (voteInfo.activeStep === 2) {
      if (
        !isSameDate(dateValue, new Date()) ||
        dateValue - new Date(new Date().getTime() + DELAY) > 0
      ) {
        setVoteInfo({
          ...voteInfo,
          activeStep: voteInfo.activeStep + 1,
          startDate: dateValue,
        });
        setDateValue(new Date(dateValue.getTime() + DELAY + 60 * 1000));
      } else {
        alert(
          `Update start time or date to be ${MINUTES_DELAY} minutes after the current time`
        );
      }
    }
    // End date
    else if (voteInfo.activeStep === 3) {
      if (
        !isSameDate(dateValue, new Date()) || // check if the date is today
        (dateValue - new Date(new Date().getTime() + DELAY) > 0 && // or we are choosing a time in the future
          dateValue - new Date(voteInfo.startDate.getTime() + DELAY) > 0)
      ) {
        setVoteInfo({
          ...voteInfo,
          activeStep: voteInfo.activeStep + 1,
          endDate: dateValue,
        });
      } else {
        alert(
          `Update end time or date to be ${MINUTES_DELAY} minutes after the start time`
        );
      }
    } else {
      setVoteInfo({
        ...voteInfo,
        activeStep: voteInfo.activeStep + 1,
      });
    }
  };

  const handleBack = () => {
    setVoteInfo({ ...voteInfo, activeStep: voteInfo.activeStep - 1 });
  };

  const content = (
    <div>
      {voteInfo.activeStep === 0 && (
        <SelectParticipants handleNext={handleNext} />
      )}
      {voteInfo.activeStep === 1 && (
        <SelectCandidates handleNext={handleNext} />
      )}
      {voteInfo.activeStep === 2 && (
        <DatePicker
          dateValue={dateValue}
          setDateValue={setDateValue}
          earliestDate={new Date(new Date().getTime() + DELAY + 60000)} // earliest start date is today
          endDate={
            new Date(
              new Date().getFullYear() + 7, // set endDate to 7 years in the future
              new Date().getMonth(),
              new Date().getDate()
            )
          }
          label="Start"
          handleNext={handleNext}
          handleBack={handleBack}
        />
      )}
      {voteInfo.activeStep === 3 && (
        <DatePicker
          dateValue={dateValue}
          setDateValue={setDateValue}
          earliestDate={new Date(voteInfo.startDate.getTime())}
          endDate={
            new Date(
              voteInfo.startDate.getFullYear() + 7, // set endDate to 7 years in the future
              voteInfo.startDate.getMonth(),
              voteInfo.startDate.getDate()
            )
          }
          label="End"
          handleNext={handleNext}
          handleBack={handleBack}
        />
      )}
      {voteInfo.activeStep === 4 && (
        <ReviewDetails handleNext={handleNext} handleBack={handleBack} />
      )}
      {voteInfo.activeStep === 5 && <Payment handleBack={handleBack} />}
    </div>
  );
  return <WorkflowDrawer steps={steps} content={content} />;
};

export default CreateVoteWorkflow;
