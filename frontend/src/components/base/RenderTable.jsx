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
import PlusOneIcon from "@mui/icons-material/PlusOne";

const rowsPerPage = 50;

export default function StickyHeadTable({ stage }) {
	const [page, setPage] = React.useState(0);
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);

	const updatePerson = (row, type = "decrement") => {
		const newNumVotes =
			type === "decrement" ? row.numVotes - 1 : row.numVotes + 1;
		const newVoteInfo = JSON.parse(JSON.stringify(voteInfo));
		if (newNumVotes === 0) {
			if (stage === "participants") {
				if (row.name.includes("New Account")) {
					const highestNumAccount = `New Account ${voteInfo.numNewAccounts}`;
					newVoteInfo.numNewAccounts--;
					delete newVoteInfo.participantData[highestNumAccount];
				} else {
					delete newVoteInfo.participantData[row.name];
				}
				newVoteInfo.numParticipants--;
			} else {
				delete newVoteInfo.candidateData[row.name];
			}
			setVoteInfo(newVoteInfo);
		} else if (stage === "participants") {
			if (type === "decrement") {
				newVoteInfo.participantData[row.name]--;
			} else {
				newVoteInfo.participantData[row.name]++;
			}
		}

		setVoteInfo(newVoteInfo);
	};

	const columns =
		stage === "participants"
			? [
					{ id: "name", label: "Account Address", minWidth: 170 },
					{ id: "numVotes", label: "Number of Votes", minWidth: 170 },
					{ id: "add", label: "", align: "right" },
					{ id: "cancel", label: "", align: "right" },
			  ]
			: [
					{ id: "id", label: "ID", minWidth: 170 },
					{ id: "name", label: "Name", minWidth: 170 },
					{ id: "cancel", label: "", align: "right" },
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
				add:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() =>
								updatePerson({ numVotes, name }, "increment")
							}
						>
							<PlusOneIcon />
						</IconButton>
					),
				cancel:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() => updatePerson({ numVotes, name })}
						>
							<PersonRemoveIcon />
						</IconButton>
					),
			});
		}
	} else if (stage === "candidates" && voteInfo.candidateData) {
		let id = 1;
		Object.keys(voteInfo.candidateData).forEach((name) => {
			rows.push({
				id,
				name,
				cancel:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() => updatePerson({ numVotes: 1, name })}
						>
							<PersonRemoveIcon />
						</IconButton>
					),
			});
			id++;
		});
	}

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
