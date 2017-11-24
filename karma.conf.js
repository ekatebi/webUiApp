module.exports = function (config) {
  config.set({

    // browsers: ['Firefox'],
    browsers: ['Chrome_small'],

    customLaunchers: {
      Chrome_small: {
        base: 'Chrome',
        flags: [
            '--window-size=400,400',
            '--window-position=-400,0'
        ]
      }
    },

    singleRun: false,

    frameworks: [ 'mocha' ],

    files: ['tests.webpack.js'],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha', 'coverage' ],

    coverageReporter: {
      type: 'html',
      dir: 'coverage'
    },

    webpack: require('./webpack.karma'),
    webpackServer: { noInfo: true }

  });
};
