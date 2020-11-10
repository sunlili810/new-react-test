const path = require('path');
const {
  override, fixBabelImports, addLessLoader, useBabelRc, addWebpackAlias, addDecoratorsLegacy, disableEsLint
} = require('customize-cra');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const BundleAnalyzerPluginWebpack = (config) => {
  config.mode === 'production' ? config.plugins.push(new BundleAnalyzerPlugin()) : '';
  return config;
};
const ProgressBarPluginWebpack = (config) => {
  config.mode === 'production' ? config.plugins.push(new ProgressBarPlugin({
    format: '  build [:bar] :percent (:elapsed seconds)',
    clear: false,
    width: 60
  })) : '';
  return config;
};
const UglifyJsPluginWebpack = (config) => {
  config.mode === 'production' ? config.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      ie8: false,
      ecma: 8,
      mangle: true,
      output: {
        comments: false,
        beautify: false
      },
      compress: true,
      warnings: false
    }
  })) : '';
  return config;
};
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  disableEsLint(),
  addDecoratorsLegacy(),
  BundleAnalyzerPluginWebpack,
  ProgressBarPluginWebpack,
  UglifyJsPluginWebpack,
  addWebpackAlias({
    components: path.join(__dirname, './src/components'),
    images: path.join(__dirname, './src/res/images'),
    medias: path.join(__dirname, './src/res/media'),
    iconfonts: path.join(__dirname, './src/res/iconfont'),
    // media: path.join(__dirname, '../res/media'),
    pages: path.join(__dirname, './src/pages'),
    localData: path.join(__dirname, './src/testdata/localdata'),
    mockData: path.join(__dirname, './src/testdata/mockdata'),
    util: path.join(__dirname, './src/utils'),
    store: path.join(__dirname, './src/store')
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#1581BF',
        '@layout-footer-background': '#252d3a',
        '@layout-trigger-background': '#252d3a',
        '@layout-trigger-color': '#fff',
        '@layout-sider-background': '#252d3a'
      }
    }

  }),
  useBabelRc()
);
