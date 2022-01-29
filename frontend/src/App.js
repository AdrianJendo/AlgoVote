import Base from "components/Base.jsx";
import AppBar from "components/AppBar";
import { lightTheme, darkTheme } from "theme/Themes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { VoteInfoProvider } from "context/VoteInfoContext";
import { ParticipateProvider } from "context/ParticipateContext";
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
						<DateValueProvider>
							<AppBar dark={dark} setDark={setDark} />
							<Base />
						</DateValueProvider>
					</ParticipateProvider>
				</VoteInfoProvider>
			</LocalizationProvider>
		</ThemeProvider>
	);
}

export default App;
