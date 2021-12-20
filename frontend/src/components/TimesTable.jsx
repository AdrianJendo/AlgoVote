import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { VoteInfoContext } from "context/VoteInfoContext";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export default function TimesTable() {
	const voteInfo = React.useContext(VoteInfoContext)[0];

	const rows = [];
	rows.push({
		name: "Date",
		start: voteInfo.startDate.toDateString(),
		end: voteInfo.endDate.toDateString(),
	});
	rows.push({
		name: "Time (add timezone)",
		start: voteInfo.startTime.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
		end: voteInfo.endTime.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
	});

	return (
		<Paper sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell></StyledTableCell>
							<StyledTableCell align="right">
								<Typography>Vote Starts</Typography>
							</StyledTableCell>
							<StyledTableCell align="right">
								<Typography>Vote Ends</Typography>
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<StyledTableRow key={row.name}>
								<StyledTableCell component="th" scope="row">
									<Typography>{row.name}</Typography>
								</StyledTableCell>
								<StyledTableCell align="right">
									<Typography>{row.start}</Typography>
								</StyledTableCell>
								<StyledTableCell align="right">
									<Typography>{row.end}</Typography>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
