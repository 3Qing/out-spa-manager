const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, './src/components'),
                '@views': path.resolve(__dirname, './src/views'),
                '@_public': path.resolve(__dirname, './src/_public'),
                '@vuex': path.resolve(__dirname, './src/vuex')
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: []
        }
    }
}
