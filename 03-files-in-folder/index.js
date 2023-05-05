const fs = require('node:fs');
const path = require('node:path');

fs.readdir(path.join(__dirname, '/secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {

    console.log("\nCurrent directory files:");
    files.forEach(file => {
      if (file.isFile()) {
        let extension = path.extname(file.name).slice(1);
        let name = path.parse(file.name).name;
        fs.stat(path.join(__dirname, '/secret-folder/', file.name), (err, stats) => {
          if (err) throw err;
          let size = stats.size / 1024 + 'kb';
          console.log(name + ' - ' + extension + ' - ' + size);
        });
      }
    })
  }
})