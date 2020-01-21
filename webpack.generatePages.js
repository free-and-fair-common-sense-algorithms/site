const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV || 'development'

const generatePage = ({ params, name }) => ({
    plugins: [
        new HtmlWebpackPlugin({
            filename: `${name}/index.html`,
            template: './src/algorithm_templates/index.hbs',
            title: name,
            templateParameters: {
                ...params,
                filename: name,
                model_source1: `./algorithm_sources/${name}`,
                model_source2: `../algorithm_sources/${name}`,
                model_source3: `algorithm_sources/${name}`,
            },
            pageName: name,
            inject: true,
            minify: (env === 'development') ? undefined : {
                removeComments: true,
                collapseWhitespace: true,
            },
        }),
    ],
})

module.exports = generatePage
