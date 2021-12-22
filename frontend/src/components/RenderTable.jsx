import * as React from "react";
import { VoteInfoContext } from "context/VoteInfoContext";
import {
	IconButton,
	Tooltip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const rowsPerPage = 50;

export default function StickyHeadTable({ stage }) {
	const [page, setPage] = React.useState(0);
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);

	const columns =
		stage === "participants"
			? [
					{ id: "name", label: "Name", minWidth: 170 },
					{ id: "numVotes", label: "Number of Votes", minWidth: 170 },
					{ id: "cancel", label: "", width: 50, align: "right" },
			  ]
			: [
					{ id: "id", label: "ID", minWidth: 170 },
					{ id: "name", label: "Name", minWidth: 170 },
					{ id: "cancel", label: "", width: 50, align: "right" },
			  ];

	if (voteInfo.activeStep === 4) {
		columns[columns.length - 1].label = (
			<Tooltip title="Edit" placement="top">
				<IconButton
					onClick={() =>
						setVoteInfo({
							...voteInfo,
							activeStep: stage === "participants" ? 0 : 1,
						})
					}
				>
					<SettingsBackupRestoreIcon />
				</IconButton>
			</Tooltip>
		);
	}

	const rows = [];
	if (stage === "participants" && voteInfo.participantData) {
		for (const [name, numVotes] of Object.entries(
			voteInfo.participantData
		)) {
			rows.push({
				name,
				numVotes,
				cancel:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() => decrementPerson({ numVotes, name })}
						>
							<PersonRemoveIcon />
						</IconButton>
					),
			});
		}
	} else if (stage === "candidates" && voteInfo.candidateData) {
		let id = 1;
		for (const name of Object.keys(voteInfo.candidateData)) {
			rows.push({
				id,
				name,
				cancel:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() =>
								decrementPerson({ numVotes: 1, name })
							}
						>
							<PersonRemoveIcon />
						</IconButton>
					),
			});
			id++;
		}
	}

	const decrementPerson = (row) => {
		const newNumVotes = row.numVotes - 1;
		const newVoteInfo = Object.assign({}, voteInfo);
		if (newNumVotes === 0) {
			const newVoteInfo = Object.assign({}, voteInfo);
			if (stage === "participants") {
				delete newVoteInfo.participantData[row.name];
			} else {
				delete newVoteInfo.candidateData[row.name];
			}
			setVoteInfo(newVoteInfo);
		} else {
			if (stage === "participants") {
				newVoteInfo.participantData[row.name]--;
			} else {
				newVoteInfo.candidateData[row.name]--;
			}
		}
		setVoteInfo(newVoteInfo);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<Paper sx={{ maxHeight: "100%", width: "100%", overflow: "hidden" }}>
			<TableContainer
				sx={{ maxHeight: rows.length > rowsPerPage ? "85%" : "100%" }}
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
							.map((row, index) => {
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
