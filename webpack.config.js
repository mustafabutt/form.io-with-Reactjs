var babelOptions = {
    "presets": ["es2015","react"]
};
const autoprefixer = require('autoprefixer')

module.exports = {
    entry: './src/index.jsx',
    output: {
        filename: './dist/bundle.js',
        path: __dirname
    },
    module: {
        rules: [ {
            test: /\.js(x?)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            ]
        },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [autoprefixer('last 5 versions')]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
                // loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            }
        ]
    },
    resolve: {
        extensions: [".jsx", ".js", "json"]
    },
};
