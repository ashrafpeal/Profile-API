const path = require('path');
const fs = require('fs');
// src ফোল্ডারের সব entry খুঁজে বের করা
const entryDir = path.resolve(__dirname, 'src');
const entries = {};

fs.readdirSync(entryDir).forEach(file => {
  const ext = path.extname(file);
  const name = path.basename(file, ext);

  if (ext === '.js' || ext === '.jsx') {
    entries[name] = path.resolve(entryDir, file);
  }
});

module.exports = {
  entry: entries, // সব entry dynamically add হবে
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js', // entry file নাম অনুযায়ী bundle হবে
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/, // images, fonts + webp/jpeg
        type: 'asset/resource', // modern Webpack 5 way
        generator: {
          filename: 'assets/img/[hash][ext][query]', // output path
        },
      },
      {
        test: /\.(woff2?|ttf|eot)$/, // fonts
        type: 'asset/resource', // modern Webpack 5 way
        generator: {
          filename: 'assets/fonts/[hash][ext][query]', // output path
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // videos & audio
        type: 'asset/resource',
        generator: {
          filename: 'assets/video/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: process.env.NODE_ENV || 'development',
  
};
