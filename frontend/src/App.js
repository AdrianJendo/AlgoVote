import Base from "components/Base.jsx";
import AppBar from "components/AppBar";
import { lightTheme, darkTheme } from "theme/Palletes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";

function App() {
	const [dark, setDark] = useState(true);

	return (
		<ThemeProvider
			theme={dark ? createTheme(darkTheme) : createTheme(lightTheme)}
		>
			<AppBar dark={dark} setDark={setDark} />
			<Base />
		</ThemeProvider>
	);
}

export default App;
