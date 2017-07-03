const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const config = module.exports = {
  plugins: []
};

// Set context to root of project

// Client entry
config.entry = {
  Vue2MapboxGL: path.resolve(__dirname, 'src/main')
};

// Basic output config
config.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'vue2mapbox-gl.js',
  library: ["Vue2MapboxGL"],
  libraryTarget: "umd",
};

config.externals = [{
  'mapbox-gl': {
    umd: 'mapbox-gl',
    root: 'mapbox-gl',
    global: 'mapbox-gl',
    commonjs2: 'mapbox-gl',
    commonjs: 'mapbox-gl',
    amd: 'mapbox-gl'
  },
  'vue': {
    umd: 'Vue',
    global: 'Vue',
    root: 'Vue',
    commonjs2: 'vue',
    commonjs: 'vue',
    amd: 'vue'
  }
}];
// Resolver config
config.resolve = {
  extensions: ['.js', '.vue'],
  enforceExtension: false
};

config.resolveLoader = {
  modules: config.resolve.modules
};

config.module = {
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      // important: exclude files in node_modules, otherwise it's going to be really slow!
      exclude: /node_modules|vendor/
    },
    {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    },
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.output.filename = "vue2mapbox-gl.min.js"
  config.devtool = '#source-map';

  // Pass build environment inside bundle
  // This will strip comments in Vue code & hort-circuits all Vue.js warning code
  config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }));

  // The UglifyJsPlugin will no longer put loaders into minimize mode, and the debug option has been deprecated.
  config.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));

  // Minify with dead-code elimination
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false},
    sourceMap: true
  }));
} else {
  config.devtool = '#eval-source-map';
}
