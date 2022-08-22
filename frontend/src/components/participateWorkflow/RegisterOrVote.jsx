import React, { useContext } from "react";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";
import { FillDiv, buttonGroupSX } from "utils/Style/ParticipantsStyle";
import { typographySX } from "utils/Style/WorkflowStyle";

const RegisterOrVote = ({ handleNext, handleBack }) => {
  const [participateInfo, setParticipateInfo] = useContext(ParticipateContext);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Typography sx={{ padding: "30px" }} variant="h5">
        Are you registering for a vote or voting?
      </Typography>

      <FillDiv>
        <Typography sx={typographySX(4)}>
          Select one of the options below
        </Typography>
        <ButtonGroup sx={buttonGroupSX(10)}>
          <Button
            sx={{
              width: 125,
            }}
            variant={
              participateInfo.registerOrVote === "register"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setParticipateInfo({
                ...participateInfo,
                registerOrVote: "register",
              })
            }
          >
            Registering
          </Button>
          <Button
            sx={{
              width: 125,
            }}
            variant={
              participateInfo.registerOrVote === "vote"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setParticipateInfo({
                ...participateInfo,
                registerOrVote: "vote",
              })
            }
          >
            Voting
          </Button>
        </ButtonGroup>
      </FillDiv>
      <ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
        <Button onClick={() => handleBack()}>Cancel</Button>
        {participateInfo.registerOrVote && (
          <Button onClick={() => handleNext()}>Next</Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default RegisterOrVote;
