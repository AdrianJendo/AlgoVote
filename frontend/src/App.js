import Base from "components/base/Base";
import AppBar from "components/base/AppBar";
import { lightTheme, darkTheme } from "theme/Themes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { VoteInfoProvider } from "context/VoteInfoContext";
import { ParticipateProvider } from "context/ParticipateContext";
import { VoteResultsProvider } from "context/VoteResultsContext";
import { DateValueProvider } from "context/DateValueContext";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function App() {
	const [dark, setDark] = useState(true);

	return (
		<ThemeProvider
			theme={dark ? createTheme(darkTheme) : createTheme(lightTheme)}
		>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<VoteInfoProvider>
					<ParticipateProvider>
						<VoteResultsProvider>
							<DateValueProvider>
								<AppBar dark={dark} setDark={setDark} />
								<Base />
							</DateValueProvider>
						</VoteResultsProvider>
					</ParticipateProvider>
				</VoteInfoProvider>
			</LocalizationProvider>
		</ThemeProvider>
	);
}

export default App;
