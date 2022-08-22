import React, { useContext } from "react";
import { TextField, Typography, Button, ButtonGroup } from "@mui/material";
import { VoteResultsContext } from "context/VoteResultsContext";
import lookupVote from "utils/voteResultsWorkflow/LookupVote";

const EnterVoteInfo = ({ handleNext, handleBack }) => {
  const [voteResults, setVoteResults] = useContext(VoteResultsContext);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "80%",
        left: "10%",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, padding: "30px" }}
      >
        Enter the application id below
      </Typography>
      <div
        style={{
          padding: "20px",
        }}
      >
        <TextField
          label="Application Id"
          autoFocus={true}
          placeholder="Enter App Id"
          sx={{ width: "200px", margin: "20px" }}
          value={voteResults.appId}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              voteResults.appId &&
              !isNaN(voteResults.appId)
            ) {
              e.preventDefault();
              lookupVote(voteResults, setVoteResults);
            } else if (e.key === "Enter") {
              alert("Invalid app id");
            }
          }}
          onChange={(e) =>
            setVoteResults({
              ...voteResults,
              appId: e.target.value,
            })
          }
        />
      </div>
      <ButtonGroup variant="contained">
        <Button onClick={() => handleBack()}>Cancel</Button>
        {voteResults.appId && !isNaN(voteResults.appId) && (
          <Button onClick={() => handleNext()}>Next</Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default EnterVoteInfo;
