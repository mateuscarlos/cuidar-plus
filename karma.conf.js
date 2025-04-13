const path = require('path-browserify');

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', 'webpack'],
        files: [
            'src/test.ts',
            'src/**/*.spec.ts'
        ],
        preprocessors: {
            'src/test.ts': ['webpack'],
            'src/**/*.spec.ts': ['webpack']
        },
        webpack: {
            mode: 'development',
            resolve: {
                fallback: {
                    path: false, // Não é necessário incluir 'path' no navegador
                    fs: false    // Não é necessário incluir 'fs' no navegador
                },
                extensions: ['.ts', '.js']
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    }
                ]
            },
            // Limites para evitar problemas de memória
            performance: {
                maxEntrypointSize: 4194304,
                maxAssetSize: 4194304,
                hints: false
            }
        },
        plugins: [
            'karma-jasmine',
            'karma-webpack',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-spec-reporter'
        ],
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        browsers: ['ChromeHeadless'],
        // Aumentar esses tempos limite para evitar timeouts
        captureTimeout: 60000,
        browserDisconnectTimeout: 60000,
        browserNoActivityTimeout: 60000,
        browserDisconnectTolerance: 3,
        // Executar menos testes em cada rodada para evitar problemas de memória
        concurrency: 1,
        singleRun: true,
        logLevel: config.LOG_INFO,
        port: 9876,
        colors: true,
        autoWatch: false
    });
};