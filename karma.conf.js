// Karma configuration
// Generated on Sun Dec 06 2015 21:52:57 GMT-0500 (Eastern Standard Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'public/test/js/google.js',
            'public/js/angular.js',
            'public/js/angular-mocks.js',
            'public/js/angular-route.js',
            'public/js/angular-animate.min.js',
            'public/js/ui-bootstrap-tpls-0.12.1.js',
            'public/js/ng-password-strength.min.js',
            'public/js/sociali.js',
            'public/services/userService.js',
            'public/services/myEventsService.js',
            'public/services/preferenceService.js',
            'public/js/jquery-2.1.4.min.js',
            'public/views/**/*.js',
            'public/test/**/*.js'

        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        //reporters: ['progress'],
        reporters: ['dots', 'junit'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity,

        junitReporter: {
            outputFile: 'test-results.xml'
        }

    })
};
