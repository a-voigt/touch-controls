var webpack = require('webpack');  
module.exports = {
    output: {
        path: __dirname + '/lib',
        filename: "index.js"
    },
    externals: {
        react: 'React'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin()
    ]

};
