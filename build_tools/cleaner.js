const fs = require('fs');
const rimraf = require('rimraf');
const pt = require('path');

const args = process.argv.slice(2);

for (let arg of args) {
    const path = pt.join(__dirname, '..', arg);
    if (fs.existsSync(path)) {
        rimraf(path, () => {
            console.log(`Cleaned ${path}`);
        });
    }
}