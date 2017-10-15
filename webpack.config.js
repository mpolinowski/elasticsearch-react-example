module.exports = {
	entry: './src/app.js',
	output: {
		filename: "index.js"
	},
	module: {
		rules: [
			{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      },
		]
	}
};
