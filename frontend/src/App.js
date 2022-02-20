import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "theme/Themes";

// Mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { styled } from "@mui/system";

// Context
import { VoteInfoProvider } from "context/VoteInfoContext";
import { ParticipateProvider } from "context/ParticipateContext";
import { VoteResultsProvider } from "context/VoteResultsContext";
import { DateValueProvider } from "context/DateValueContext";

// Components
import ChooseOption from "components/base/ChooseOption";
import CreateWorkflow from "components/createWorkflow/CreateWorkflow";
import ParticipateWorkflow from "components/participateWorkflow/ParticipateWorkflow";
import VoteResultsWorkflow from "components/voteResultsWorkflow/VoteResultsWorkflow";
import AppBar from "components/base/AppBar";

const Dashboard = styled("div")(
	({ theme }) => `
		background-color: ${theme.palette.background.default};
		width: 100%;
		height: calc(100vh - 64px);
	`
);

const StyledBackground = styled("div")(
	({ theme }) => `
		height: 100%;
		background: ${theme.palette.background.paper};
		overflow-y: hidden;
	`
);

function App() {
	const [dark, setDark] = useState(true);

	return (
		<Router>
			<ThemeProvider
				theme={dark ? createTheme(darkTheme) : createTheme(lightTheme)}
			>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<VoteInfoProvider>
						<ParticipateProvider>
							<VoteResultsProvider>
								<DateValueProvider>
									<AppBar dark={dark} setDark={setDark} />
									<Dashboard>
										<StyledBackground>
											<Routes>
												<Route
													path="/"
													element={<ChooseOption />}
												/>
												<Route
													path="/createVote"
													element={<CreateWorkflow />}
												/>
												<Route
													path="/participateVote"
													element={
														<ParticipateWorkflow />
													}
												/>
												<Route
													path="/voteResults"
													element={
														<VoteResultsWorkflow />
													}
												/>
											</Routes>
										</StyledBackground>
									</Dashboard>
								</DateValueProvider>
							</VoteResultsProvider>
						</ParticipateProvider>
					</VoteInfoProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</Router>
	);
}

export default App;
