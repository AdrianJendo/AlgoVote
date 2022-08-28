import React, { useContext } from "react";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/misc/CancelVote";
import submitVote from "utils/participateWorkflow/SubmitVote";
import submitRegister from "utils/participateWorkflow/SubmitRegister";
import ProgressBar from "components/base/ProgressBar";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  styled,
  Link,
  ButtonGroup,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useNavigate } from "react-router-dom";
import { BASE_URL, TXN_FEE } from "constants";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ReviewAndPay = ({ handleBack }) => {
  const [participateInfo, setParticipateInfo] = useContext(ParticipateContext);
  const navigate = useNavigate();

  const rows = [];
  if (participateInfo.registerOrVote === "vote") {
    rows.push({
      name: "Selected Candidate",
      value: <i>{participateInfo.selectedCandidate}</i>,
    });
  }
  rows.push({
    name: "Application Id",
    value: <i>{participateInfo.appId}</i>,
  });
  rows.push({
    name: "Estimated transaction fee",
    value: <i>{(TXN_FEE * 2) / 1e6} Algos</i>, // 2 txns -> 1 for ASA and 1 for smart contract
  });

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Typography sx={{ margin: "30px" }} variant="h5">
        Review the details of this transaction
      </Typography>
      <div
        style={{
          marginTop: 20,
          marginRight: 30,
          marginLeft: 30,
          marginBottom: 60,
          overflow: "auto",
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell align="center" sx={{ width: "50%" }}>
                  <Typography>
                    <b>{row.name}</b>
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography>{row.value}</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!participateInfo.voteSubmitted && (
        <ButtonGroup variant="contained" sx={{ margin: "10px" }}>
          <Button
            onClick={() => cancelParticipate(setParticipateInfo, navigate)}
          >
            Cancel
          </Button>
          <Button onClick={() => handleBack()}>Back</Button>
          <Button
            variant="contained"
            onClick={async () => {
              const resp =
                participateInfo.registerOrVote === "vote"
                  ? await submitVote(participateInfo, setParticipateInfo)
                  : await submitRegister(participateInfo, setParticipateInfo);
              if (resp.error) {
                alert(resp.error);
              }
            }}
          >
            Confirm
          </Button>
        </ButtonGroup>
      )}
      {participateInfo.txId && (
        <div style={{ marginBottom: "30px" }}>
          <Typography sx={{ fontSize: "18px" }} variant="text">
            Transaction{" "}
            <Link
              href={`${BASE_URL}/tx/${participateInfo.txId}`}
              target="_blank"
              underline="hover"
            >
              {participateInfo.txId}
            </Link>{" "}
            successfully submitted
          </Typography>
        </div>
      )}

      {participateInfo.voteSubmitted && !participateInfo.txId && (
        <div style={{ padding: "50px" }}>
          <ProgressBar text="Sending Transaction..." />
        </div>
      )}
      {participateInfo.voteSubmitted && participateInfo.txId && (
        <Button
          variant="contained"
          onClick={() => cancelParticipate(setParticipateInfo, navigate)}
        >
          Home
        </Button>
      )}
    </div>
  );
};

export default ReviewAndPay;
