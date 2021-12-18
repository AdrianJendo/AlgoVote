import React, { useState } from "react";

const Base = () => {
	const [buttonClicked, setButtonClicked] = useState(false);

	const handleButtonClicked = () => {
		setButtonClicked(true);
	};

	return (
		<div className="App">
			{!buttonClicked ? (
				<button onClick={handleButtonClicked}>Create vote</button>
			) : (
				<h2>You have started a vote</h2>
			)}
		</div>
	);
};

export default Base;
