const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const generatePage = require('./webpack.generatePages')

const env = process.env.NODE_ENV || 'development'
const TITLE = 'Free and Fair Commonsense Algorithms for Society'


function readFiles(dir, processFiles) {
    fs.readdirSync(dir).forEach((filename) => {
        const filepath = path.resolve(dir, filename)
        const { name } = path.parse(filename)
        const params = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'))
        params.title = `${params.name} - ${TITLE}`
        const stat = fs.statSync(filepath)
        if (stat.isFile()) processFiles({ name, params })
    })
}

const pageNames = []
readFiles('./src/algorithm_configs', json => pageNames.push(json))

const pages = {
    plugins: [
        new HtmlWebpackPlugin({
            title: TITLE,
            template: path.resolve(__dirname, 'src', 'index.hbs'),
            templateParameters: {
                title: `${TITLE}`,
                algorithms: [
                    {
                        name: 'Bail Amount Algorithm',
                        filename: 'bail_amount',
                        description: 'The Bail Amount Algorithm assists court officers in objectively determining the amount of bail based on information about the defendant.',
                    },
                    {
                        name: 'Health Insurance Claim Algorithm',
                        filename: 'health_insurance_claim',
                        description: 'The Health Insurance Claim Algorithm helps insurance companies determine the percent coverage of an individual’s hospital bill.',
                    },
                    {
                        name: 'Higher Education Grant Algorithm',
                        filename: 'higher_education_grant',
                        description: 'The Higher Education Grant Algorithm helps calculate the amount that should be awarded to applicants of Federal grant funding.',
                    },
                ],
            },
            inject: true,
            minify: (env === 'development') ? undefined : {
                removeComments: true,
                collapseWhitespace: true,
            },
        }),
        new HtmlWebpackPlugin({
            title: 'Info',
            filename: 'info.html',
            template: path.resolve(__dirname, 'src', 'info.hbs'),
            templateParameters: {
                title: `Info - ${TITLE}`,
            },
            inject: true,
            minify: (env === 'development') ? undefined : {
                removeComments: true,
                collapseWhitespace: true,
            },
        }),
    ],
}

const plugins = {
    plugins: [
      new PreloadWebpackPlugin({
          rel: 'preload',
          include: 'allAssets',
      }),
    ]
}

module.exports = [
    pages,
    ...pageNames.map(json => generatePage(json)),
    plugins,
]
