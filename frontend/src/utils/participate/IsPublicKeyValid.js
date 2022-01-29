const isPublicKeyValid = (key) => {
	return key && key.length === 58;
};

export default isPublicKeyValid;
