const { series, src, dest, parallel } = require('gulp');
const ts = require('gulp-typescript');
const exec = require('child_process').exec;
const del = require('delete');

const tsProject = ts.createProject('backend/tsconfig.json');

function clean(cb) {
    return del(['build'], cb);
}

function buildBackend() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(dest('build/src'));
}

function moveBackendDeps() {
    return src('backend/node_modules/**/*')
        .pipe(dest('build/node_modules'));
}

function moveBackendFiles() {
    return src('backend/.env')
        .pipe(dest('build'));
}

function buildFrontend(cb) {
    exec('npm run build', { 
        cwd: 'frontend' 
    }, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

function moveFrontend() {
    return src('frontend/build/**/*')
        .pipe(dest('build/src/public'));
}

exports.default = series(
    clean, 
    parallel(
        moveBackendDeps,
        moveBackendFiles,
        buildBackend,
        series(
            buildFrontend, 
            moveFrontend
        )
    )
);