import React, { useState, createContext } from "react";

export const DateValueContext = createContext();

export const DateValueProvider = (props) => {
	const [dateValue, setDateValue] = useState({
		error: false,
		value: null,
		timeValue: null,
	});
	return (
		<DateValueContext.Provider value={[dateValue, setDateValue]}>
			{props.children}
		</DateValueContext.Provider>
	);
};
