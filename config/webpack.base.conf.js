const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
}
// plugin надо регистрировать

module.exports = {
    externals: { // чтоб получить доступ из других файлов к PATHS
        paths: PATHS
    },

    entry: {
        app: PATHS.src
    },
    output: {
        filename: `${PATHS.assets}js/[name].[hash].js`,
        path: PATHS.dist,
        publicPath: '/' // for dev server
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // чтоб браузер понимал что файлы поменялись нужно задавтаь хэш
                vendor: {
                    name: 'vendors', // в файл vendors ложит библиотеки
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: './img/[name].[ext]',
                },
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader',
                options: {
                    name: './sounds/[name].[ext]',
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[ext]'
                }
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader, // для разбивки файлов
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: true, config: { path: "./postcss.config.js" } }
                    },
                    {
                        loader: 'less-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader, // для разбивки файлов
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: true, config: { path: "./postcss.config.js" } }
                    }
                ]
            }
        ]

    },
    resolve: {
        alias: {
            '~': 'src',
            'vue$': 'vue/dist/vue.js' // можем использовать requeire(vue)
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].[hash].css`
        }),
        new HtmlWebpackPlugin({
            template: `./public/index.html`, // ищи там то
            filename: `./index.html`
        }),
        new CopyWebpackPlugin([
            { from: `${PATHS.src}/img`, to: `img` },
            { from: `${PATHS.src}/fonts`, to: `fonts` },
            { from: `${PATHS.src}/sounds`, to: `sounds` },
            { from: `${PATHS.src}/icon`, to: 'icon' },
            { from: `${PATHS.src}/styles`, to: 'styles' }
        ])
    ]

}

//webpack-merge - для разделения прод и дев разработку