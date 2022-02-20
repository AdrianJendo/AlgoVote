const isSameDate = (value, earliestDate) => {
	if (!value) {
		return true;
	}
	const dateValueDate = new Date(
		value.getFullYear(),
		value.getMonth(),
		value.getDate()
	);
	const earliestDateDate = new Date(
		earliestDate.getFullYear(),
		earliestDate.getMonth(),
		earliestDate.getDate()
	);

	return dateValueDate - earliestDateDate === 0;
};

export default isSameDate;
