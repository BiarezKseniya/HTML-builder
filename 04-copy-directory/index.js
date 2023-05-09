const fs = require('node:fs');
const fsPromises = require('fs').promises;
const path = require('node:path');

function copyDir() {
  fsPromises.mkdir(path.join(__dirname, '/files-copy'), { recursive: true })
  fs.readdir(path.join(__dirname, '/files-copy'), { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(oldFile => {
        fs.unlink(path.join(__dirname, '/files-copy/', oldFile.name), (err) => {
          if(err) throw err; 
        })
      })
    }
  })
  fs.readdir(path.join(__dirname, '/files'), { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fsPromises.copyFile(path.join(__dirname, '/files/', file.name), path.join(__dirname, '/files-copy/', file.name))
      })
    }
  })
}

copyDir();