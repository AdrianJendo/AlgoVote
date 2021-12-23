export const getRoute = (req, res) => {
	res.send([{ some: "jsondata", get: "this is get route" }]);
};

export const postRoute = (req, res) => {
	// const data = req.body;
	res.send([{ post: "this is post route" }]);
};
