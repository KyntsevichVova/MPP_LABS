const fs = require('fs');
const pt = require('path');

const args = process.argv.slice(2);

for (let i = 0; i < args.length; i += 2) {
    const src = pt.join(__dirname, '..', '\\', args[i]);
    const dest = pt.join(__dirname, '..', '\\', args[i + 1]);
    copy(src, dest);
}

function copy(src, dest) {
    if (fs.lstatSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        const paths = fs.readdirSync(src);
        for (let path of paths) {
            copy(`${src}\\${path}`, `${dest}\\${path}`);
        }
    } else {
        fs.copyFile(src, dest, () => {
            console.log(`Copied ${src} to ${dest}`);
        });
    }
    
}