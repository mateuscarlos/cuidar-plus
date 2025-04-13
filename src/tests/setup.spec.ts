import { configure } from 'jasmine-core';

configure({
    spec_dir: 'src/tests',
    spec_files: [
        '**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});