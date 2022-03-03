export const lightTheme = {
	palette: {
		primary: {
			main: "#3d5afe",
			dark: "#3d5afe",
		},
		secondary: {
			main: "#9c27b0",
		},
		background: {
			default: "#EFEFEF",
			paper: "#bbdefb",
		},
		error: {
			main: "#f44336",
		},
		text: {
			primary: "#000000",
		},
	},
	stepperButtonColor: "rgba(0, 0, 0, 0.4)",
};

export const darkTheme = {
	palette: {
		primary: {
			main: "#673ab7", //1a237e 651fff
		},
		secondary: {
			main: "#512da8",
		},
		error: {
			main: "#f44336",
		},
		background: {
			default: "#202124",
			paper: "#323639",
		},
		text: {
			primary: "#fff",
			secondary: "#fff",
		},
	},
	stepperButtonColor: "#000000",
	components: {
		MuiButton: {
			variants: [
				{
					props: { variant: "text", color: "primary" },
					style: {
						color: "#fff",
						"&:hover": {
							background: "#512da8",
						},
					},
				},
			],
		},
		MuiIconButton: {
			styleOverrides: {
				// Name of the slot
				root: {
					// Some CSS
					color: "#fff",
				},
			},
		},
	},
	typography: {
		body1: {
			color: "#fff",
		},
	},
};
