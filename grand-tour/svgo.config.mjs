export default {
	multipass: true,
	js2svg: {
		pretty: false,
		indent: 2,
	},
	plugins: [
		{
			name: "preset-default",
			params: {
				overrides: {
					cleanupIds: false,
				},
			},
		},
		"sortAttrs",
	],
};
