import React, { useContext } from "react";
import { ParticipateContext } from "context/ParticipateContext";
import submitVote from "utils/participateWorkflow/submitVote";

import {
	Typography,
	Button,
	Table,
	TableBody,
	TableRow,
	styled,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const ReviewAndPay = () => {
	const [participateInfo, setParticipateInfo] =
		useContext(ParticipateContext);

	const rows = [];
	rows.push({
		name: "Selected Candidate",
		value: <i>{participateInfo.selectedCandidate}</i>,
	});
	rows.push({
		name: "Application Id",
		value: <i>{participateInfo.appId}</i>,
	});
	rows.push({
		name: "Estimated transaction fee",
		value: (
			<div>
				<i>0.001</i> Algos
			</div>
		),
	});

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={{ position: "relative", top: "2%" }} variant="h5">
				Review the details of this transaction
			</Typography>
			<div
				style={{
					marginTop: 100,
					marginRight: 300,
					marginLeft: 300,
					marginBottom: 60,
					overflow: "hidden",
				}}
			>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableBody>
						{rows.map((row) => (
							<StyledTableRow key={row.name}>
								<StyledTableCell sx={{ width: "50%" }}>
									<Typography>
										<b>{row.name}</b>
									</Typography>
								</StyledTableCell>
								<StyledTableCell align="center">
									<Typography>
										<i>{row.value}</i>
									</Typography>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Button
				variant="contained"
				onClick={() => submitVote(participateInfo, setParticipateInfo)}
			>
				Confirm
			</Button>
		</div>
	);
};

export default ReviewAndPay;