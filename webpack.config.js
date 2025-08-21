module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "./build/bundle.js"
    },
    module: {
        loaders: [
        {
            test: /.js$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
            presets: [["env", "react"]],
            plugins: ["transform-class-properties"]
            }
        }
        ]
    }
};