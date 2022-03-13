import React, { useState, createContext } from "react";

export const AlertContext = createContext();

export const AlertProvider = (props) => {
	const [open, setOpen] = useState(false);

	return (
		<AlertContext.Provider value={[open, setOpen]}>
			{props.children}
		</AlertContext.Provider>
	);
};
