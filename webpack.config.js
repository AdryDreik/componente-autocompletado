const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: path.resolve(`${__dirname}/html/autocompletado-html.vue`),
  mode: 'development',
  output: {
    path: path.resolve(`${__dirname}/dist/`),
    filename: 'component-autocomplete.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('html'), resolve('pdf')]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  externals: {
    axios: 'axios',
    'vue2-ace-editor': 'vue2-ace-editor',
    'validate.js': 'validate.js',
    'brace/ext/language_tools': 'brace/ext/language_tools',
    'brace/mode/html': 'brace/mode/html',
    'brace/mode/javascript': 'brace/mode/javascript',
    'brace/mode/less': 'brace/mode/less',
    'brace/theme/chrome': 'brace/theme/chrome',
    slugify: 'slugify',
    vuetify: 'vuteify'
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new VueLoaderPlugin()
  ]
};