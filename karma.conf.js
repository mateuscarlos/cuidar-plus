module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/tests/setup.spec.ts'
        ],
        browsers: ['Chrome'],
        singleRun: true
    });
};