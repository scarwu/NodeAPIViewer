'use strict'
/**
 * Webpack Config
 *
 * @package     NodeJS API Viewer
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

const path = require('path')
const webpack = require('webpack')
const webpackLodashPlugin = require('lodash-webpack-plugin')
const webpackOptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const webpackMiniCssExtractPlugin = require('mini-css-extract-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')

function cssLoaders (options) {
    options = options || {}

    let cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    let postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders (loader, loaderOptions) {
        let loaders = options.usePostCSS
            ? [cssLoader, postcssLoader]
            : [cssLoader]

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        return [webpackMiniCssExtractPlugin.loader].concat(loaders)
        // if (options.extract) {
        //     return [webpackMiniCssExtractPlugin.loader].concat(loaders)
        // } else {
        //     return ['vue-style-loader'].concat(loaders)
        // }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
function styleLoaders (options) {
    let output = []
    let loaders = cssLoaders(options)

    for (let extension in loaders) {
        let loader = loaders[extension]

        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
}

module.exports = {
    mode: 'development',
    entry: {
        main: './src/assets/scripts/main.js'
    },
    output: {
        filename: '[name].min.js'
    },
    resolve: {
        modules: [
            path.resolve('./src/assets/scripts'),
            'node_modules'
        ],
        extensions: [
            '.js',
            '.vue'
        ]
    },
    externals: {

    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: cssLoaders({
                        sourceMap: (process.env.NODE_ENV !== 'production'),
                        extract: (process.env.NODE_ENV === 'production')
                    }),
                    cssSourceMap: (process.env.NODE_ENV !== 'production'),
                    cacheBusting: true,
                    transformToRequire: {
                        video: [ 'src', 'poster' ],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            ...(styleLoaders({
                sourceMap: (process.env.NODE_ENV !== 'production'),
                extract: (process.env.NODE_ENV === 'production'),
                usePostCSS: true
            })),
            {
                test: /\.js$/,
                loader: (process.env.NODE_ENV !== 'production') ? '@sucrase/webpack-loader' : 'babel-loader?cacheDirectory=true',
                options: (process.env.NODE_ENV !== 'production') ? { transforms: ['jsx'] } : {}
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader'
            }
            // {
            //     test: /.jsx$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             cacheDirectory: true,
            //             plugins: [
            //                 // Stage 0
            //                 "@babel/plugin-proposal-function-bind",

            //                 // Stage 1
            //                 "@babel/plugin-proposal-export-default-from",
            //                 "@babel/plugin-proposal-logical-assignment-operators",
            //                 ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
            //                 ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            //                 ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
            //                 "@babel/plugin-proposal-do-expressions",

            //                 // Stage 2
            //                 ["@babel/plugin-proposal-decorators", { "legacy": true }],
            //                 "@babel/plugin-proposal-function-sent",
            //                 "@babel/plugin-proposal-export-namespace-from",
            //                 "@babel/plugin-proposal-numeric-separator",
            //                 "@babel/plugin-proposal-throw-expressions",

            //                 // Stage 3
            //                 "@babel/plugin-syntax-dynamic-import",
            //                 "@babel/plugin-syntax-import-meta",
            //                 ["@babel/plugin-proposal-class-properties", { "loose": false }],
            //                 "@babel/plugin-proposal-json-strings"
            //             ],
            //             presets: [
            //                 '@babel/preset-env'
            //             ]
            //         }
            //     }
            // }
        ]
    },
    plugins: [
        new vueLoaderPlugin(),
        ...((process.env.NODE_ENV !== 'production') ? [
            // new webpack.HotModuleReplacementPlugin(),
            // new webpack.NamedModulesPlugin(),
            // new webpack.NoEmitOnErrorsPlugin()
        ] : []),
        new webpack.ids.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpackMiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpackOptimizeCSSPlugin({
            cssProcessorOptions: (process.env.NODE_ENV !== 'production')
                ? { safe: true, map: { inline: false } }
                : { safe: true }
        }),
        new webpackLodashPlugin({
            caching: true,
            collections: true,
            paths: true,
            shorthands: true
        })
    ],
}