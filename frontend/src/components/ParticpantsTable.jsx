import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { VoteInfoContext } from "context/VoteInfoContext";

const rowsPerPage = 100;

const columns = [
	{ id: "name", label: "Name", minWidth: 170 },
	{ id: "numVotes", label: "Number of Votes", minWidth: 170 },
];

export default function StickyHeadTable() {
	const [page, setPage] = React.useState(0);
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);

	const rows = [];
	for (const [name, numVotes] of Object.entries(voteInfo.participantData)) {
		rows.push({ name, numVotes });
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<Paper sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
			<TableContainer
				sx={{ height: rows.length > rowsPerPage ? "85%" : "100%" }}
			>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((row) => {
								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={row.name}
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
												>
													{column.format &&
													typeof value === "number"
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			{rows.length > rowsPerPage && (
				<TablePagination
					sx={{ height: "15%" }}
					rowsPerPageOptions={[rowsPerPage]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
				/>
			)}
		</Paper>
	);
}
