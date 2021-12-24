import nodemailer from "nodemailer";
const fakeDB = [];

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "votealgo@gmail.com",
		pass: "bc1q2e9pxczcmrdju7yv6a5wjgyg0jlqkcqjaewg2ms76t8l5llxykvsyeajvk",
	},
});

const mailOptions = {
	from: "votealgo@gmail.com",
	to: "jendo3981@gmail.com, adrian.jendo@gmail.com",
	subject: "Sending Email using Node.js",
	text: "<h1>Welcome</h1><p>That was easy!</p>",
};

export const getRoute = (req, res) => {
	res.send(fakeDB);
};

export const postRoute = (req, res) => {
	const data = req.body;

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});

	fakeDB.push(data);
	console.log(data);

	res.send([{ post: data }]);
};
