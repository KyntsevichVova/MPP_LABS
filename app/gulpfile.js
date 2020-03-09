const { series, src, dest, parallel } = require('gulp');
const ts = require('gulp-typescript');
const exec = require('child_process').exec;
const del = require('delete');

const tsProject = ts.createProject('backend/tsconfig.json');

function copyUploads(source, target) {
    return () => src(`${source}/**/*`).pipe(dest(target));
}

function clean(cb) {
    return del(['build'], cb);
}

function buildBackend() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(dest('build'));
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
        .pipe(dest('build/public'));
}

function run(cb) {
    exec('node build/index.js', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

exports.build_backend = buildBackend;

exports.build_frontend = buildFrontend;

exports.build = series(
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

exports.run = run;