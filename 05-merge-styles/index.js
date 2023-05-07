const fs = require('fs');
const path = require('node:path');

let wStream = fs.createWriteStream((path.join(__dirname, '/project-dist/bundle.css')), {
  flags: 'w'
});
fs.readdir(path.join(__dirname, '/styles'), { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    let count = 0;
    const cssFiles = files.filter(file => path.extname(file.name) === '.css');
    cssFiles.forEach(file => {
      const rStream = fs.createReadStream(path.join(__dirname, '/styles/', file.name));
      rStream.pipe(wStream, { end: false })
      rStream.on('end', () => {
        count++;
        if (count === cssFiles.length) {
          wStream.end();
        } 
      });
    });
  }
})



