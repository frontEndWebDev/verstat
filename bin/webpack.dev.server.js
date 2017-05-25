const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const browserSync = require('browser-sync').create();
const webpackConfig = require('../config/webpack.dev.config');
const basePath = require('../config/webpack.config.utils').basePath;


const devServerConfig = {
  contentBase: `${basePath}/dist`,
  publicPath: webpackConfig.output.publicPath,
  watchOptions: {
    ignored: /node_modules/
  },
  historyApiFallback: {
    disableDotRule: true
  },
  compress: false,
  hot: true,
  lazy: false,
  inline: true,
  host: 'localhost',
  port: 8080,
  stats: {
    colors: true
  }
};

const compiler = webpack(webpackConfig);
const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, devServerConfig);

const handleFile = (event) => {
  if (event === 'add' || 'change' || 'unlink') {
    webpackDevMiddlewareInstance.invalidate();
    webpackDevMiddlewareInstance.waitUntilValid(() => browserSync.reload());
  }
};

browserSync.init({
  ui: false,
  open: false,
  notify: false,
  reloadOnRestart: true,
  watchOptions: {
    ignoreInitial: true
  },
  port: devServerConfig.port,
  server: {
    baseDir: `${basePath}/dist`,
    serveStaticOptions: {
      extensions: ['html']
    },
    middleware: [
      webpackDevMiddlewareInstance,
      webpackHotMiddleware(compiler)
    ]
  },
  files: [
    {
      match: [`${basePath}/src/components/**/*.?(pug|jade)`],
      fn: (event, file) => handleFile(event)
    },
    {
      match: [`${basePath}/src/data/global/*.?(json|yml)`],
      fn: (event, file) => handleFile(event)
    },
    {
      match: [`${basePath}/src/data/local/*.?(json|yml)`],
      fn: (event, file) => handleFile(event)
    },
    {
      match: [`${basePath}/config/webpack.*.js`],
      fn: (event, file) => handleFile(event)
    }
  ]
});