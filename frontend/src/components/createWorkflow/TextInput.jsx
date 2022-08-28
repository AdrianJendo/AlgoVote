import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DirectionsIcon from "@mui/icons-material/Directions";
import { VoteInfoContext } from "context/VoteInfoContext";
import shouldAddPerson from "utils/createWorkflow/ShouldAddPerson";

export default function CustomizedInputBase({ index }) {
  const [textValue, setTextValue] = React.useState("");
  const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);

  const inputRef = React.useRef();

  const addValue = () => {
    const names = textValue.split(","); // handles comma separated names
    const participants = voteInfo[index] ? voteInfo[index] : {};
    let numParticipants = voteInfo.numParticipants;
    for (let i = 0; i < names.length; ++i) {
      const name =
        index === "participantData"
          ? names[i].toUpperCase() // participants are addresses so enforce upper case,
          : names[i].toLowerCase(); // force candidates to be lower case for simplicity
      if (shouldAddPerson(name, index)) {
        if (participants[name] && index === "participantData") {
          participants[name]++;
        } else if (participants[name]) {
          alert("Candidate already exists in table");
          return;
        } else {
          if (index === "participantData") {
            numParticipants++;
          }
          participants[name] = 1;
        }
      } else {
        alert("Not valid");
        return;
      }

      if (i === names.length - 1) {
        const newVoteInfo = Object.assign({}, voteInfo);
        newVoteInfo.numParticipants = numParticipants;
        newVoteInfo[index] = participants;
        setVoteInfo(newVoteInfo);
        setTextValue("");
      }
    }
  };

  const handleChange = (e) => {
    setTextValue(e.target.value);
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: index === "participantData" ? 700 : 350,
        maxWidth: "100%",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={`Add a${
          index === "participantData" ? "n address" : " candidate"
        }`}
        inputProps={{ "aria-label": "add participant" }}
        value={textValue}
        inputRef={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            inputRef.current.blur();
          } else if (e.key === "Enter") {
            e.preventDefault();
            addValue();
          }
        }}
        onChange={handleChange}
        autoFocus={true}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        aria-label="directions"
        onClick={addValue}
      >
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
}
