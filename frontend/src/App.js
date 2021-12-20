import Base from "components/Base.jsx";
import AppBar from "components/AppBar";
import { lightTheme, darkTheme } from "theme/Palletes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { VoteInfoProvider } from "context/VoteInfoContext";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function App() {
	const [dark, setDark] = useState(false);

	return (
		<ThemeProvider
			theme={dark ? createTheme(darkTheme) : createTheme(lightTheme)}
		>
			<LocalizationProvider dateAdapter={DateAdapter}>
				<VoteInfoProvider>
					<AppBar dark={dark} setDark={setDark} />
					<Base />
				</VoteInfoProvider>
			</LocalizationProvider>
		</ThemeProvider>
	);
}

export default App;
