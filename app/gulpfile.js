const { series, src, dest, parallel } = require('gulp');
const ts = require('gulp-typescript');
const exec = require('child_process').exec;
const del = require('delete');

const tsProject = ts.createProject('backend/tsconfig.json');

function copyUploads(source, target) {
    return function copyUploads() {
        return src(`${source}/**/*`).pipe(dest(target));
    }
}

function mkdir(dir) {
    return function mkdir(cb) {
        exec(`mkdir ${dir}`, { 
            cwd: 'build' 
        }, (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
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
    exec('node index.js', {
        cwd: 'build'
    }, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

exports.build_backend = buildBackend;

exports.build_frontend = buildFrontend;

exports.build = series(
    copyUploads('build/uploads', 'uploads'),
    clean,
    parallel(
        moveBackendDeps,
        moveBackendFiles,
        buildBackend,
        series(
            buildFrontend, 
            moveFrontend
        )
    ),
    mkdir('uploads'),
    copyUploads('uploads', 'build/uploads')
);

exports.run = run;