const path = require('path');

module.exports = {

    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },

    mode: 'development',
    devtool: 'eval-source-map',

    watchOptions: {
        ignored: ['**/node_modules']
    },

    //Estos loaders sirven para incluir Boostrap 5 en el proyecto como una dependencia, pero ha habido
    //problemas para hacerlo de esta forma, asi que se incluira como CDN por el momento.
    /*
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: function() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                }, {
                    loader: 'sass-loader'
                }]
            }
        ]
    }
    */
}