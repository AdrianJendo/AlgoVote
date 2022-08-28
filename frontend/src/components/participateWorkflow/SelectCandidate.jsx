import React, { useContext } from "react";
import {
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  ButtonGroup,
} from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";
import { FillDiv } from "utils/Style/ParticipantsStyle";
import { buttonGroupSX } from "utils/Style/ParticipantsStyle";

const SelectCandidate = ({ handleNext, handleBack }) => {
  const [participateInfo, setParticipateInfo] = useContext(ParticipateContext);

  const handleChange = (e) => {
    setParticipateInfo({
      ...participateInfo,
      selectedCandidate: e.target.value,
    });
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Typography sx={{ padding: "30px" }} variant="h4">
        <b>{participateInfo.voteTitle}</b>
      </Typography>
      <FillDiv>
        <Typography>Select an option from the drop down menu</Typography>
        <FormControl sx={{ m: 3, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-label">Options</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={participateInfo.selectedCandidate}
            label="Options"
            onChange={handleChange}
          >
            {participateInfo.candidates.sort().map((candidate) => (
              <MenuItem key={candidate} value={candidate}>
                {candidate}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FillDiv>
      <ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
        <Button onClick={() => handleBack()}>Back</Button>
        {participateInfo.selectedCandidate !== "" && (
          <Button onClick={() => handleNext()}>Next</Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default SelectCandidate;
