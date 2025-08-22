const path = require('path');

module.exports = {
  entry: './src/index.js', // আপনার React entry file
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: './bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js এবং .jsx ফাইলের জন্য
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // যাতে import করার সময় extension লিখতে না হয়
  },
  mode: process.env.NODE_ENV || 'development',
};
