import React, { useState, useContext } from "react";
import {
  Button,
  Typography,
  TextField,
  Link,
  ButtonGroup,
} from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
import ProgressBar from "components/base/ProgressBar";
import { cancelVote } from "utils/misc/CancelVote";
import submitSecretKey from "utils/createWorkflow/SubmitSecretKey";
import isMnemonicValid from "utils/misc/IsMnemonicValid";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "constants";
import getTxnCost from "utils/createWorkflow/GetTxnCost";

const Payment = ({ handleBack }) => {
  const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
  const [secretKey, setSecretKey] = useState("");
  const [progressBar, setProgressBar] = useState(null);
  const [appId, setAppId] = useState(null);
  const [voteTitle, setVoteTitle] = useState("");
  const navigate = useNavigate();

  const getText = (val) => {
    switch (val) {
      case 1:
        return "Creating vote token";
      case 20:
        return "Creating smart contract";
      case 40:
        return "Funding new accounts";
      case 60:
        return "Opting in";
      case 80:
        return "Sending vote tokens";
      case 99:
        return "Exporting Vote Data";
      default:
        return "ERR";
    }
  };

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
        Add a title and paste the creator's secret key to create the vote
      </Typography>
      <TextField
        label="Vote Title"
        autoFocus={true}
        placeholder="Enter Vote Title"
        sx={{ width: "400px", margin: "20px", maxWidth: "100%" }}
        value={voteTitle}
        onChange={(e) => setVoteTitle(e.target.value)}
      />
      <Typography
        variant="text"
        component="div"
        sx={{ flexGrow: 1, padding: "10px" }}
      >
        The estimated cost of this transaction is{" "}
        <i>
          <b>
            {getTxnCost(voteInfo.numParticipants, voteInfo.numNewAccounts) /
              1e6}{" "}
            Algos
          </b>
        </i>
      </Typography>
      <div
        style={{
          position: "relative",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <TextField
          label="Secret Key"
          placeholder="Paste Secret Key"
          multiline
          rows={4}
          sx={{ width: "400px", maxWidth: "100%" }}
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>
      {progressBar === null && (
        <ButtonGroup variant="contained" sx={{ margin: "20px" }}>
          <Button onClick={handleBack}>Back</Button>
          <Button
            variant="contained"
            onClick={async () => {
              const resp = await submitSecretKey({
                secretKey,
                voteInfo,
                setVoteInfo,
                setProgressBar,
                voteTitle: voteTitle === "" ? "Algo Vote" : voteTitle,
              });
              if (resp.error) {
                setVoteInfo({ ...voteInfo, voteSubmitted: false });
                setProgressBar(null);
                alert(resp.error);
              }
              setAppId(resp);
            }}
            disabled={!isMnemonicValid(secretKey)}
          >
            Submit
          </Button>
        </ButtonGroup>
      )}
      {progressBar !== null && (
        <div style={{ padding: "50px" }}>
          {progressBar < 100 || appId === null ? (
            <ProgressBar value={progressBar} valueText={getText(progressBar)} />
          ) : (
            <div>
              <Typography sx={{ marginBottom: "20px" }} variant="h5">
                Vote with application id{" "}
                <Link
                  href={`${BASE_URL}/application/${appId}`}
                  target="_blank"
                  underline="hover"
                >
                  {appId}
                </Link>{" "}
                successfully created. Return to home
              </Typography>
              <Button
                variant="contained"
                onClick={() => cancelVote(setVoteInfo, navigate)}
              >
                Return to Home
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;
