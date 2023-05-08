const fs = require('node:fs');
const fsPromises = require('fs').promises;
const path = require('node:path');

fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

// Copy assets

function copyDir(sourcePath, targetPath) {

  fsPromises.mkdir(targetPath, { recursive: true });
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let subSourcePath = path.join(sourcePath, '/', file.name);
        let subTargetPath = path.join(targetPath, '/', file.name);
        if (file.isDirectory()) {
          copyDir(subSourcePath, subTargetPath);
        } else {
          fsPromises.copyFile(subSourcePath, subTargetPath);
        }
      })
    }
  })
}

copyDir(path.join(__dirname, '/assets'), path.join(__dirname, 'project-dist/assets'));

// Build styles

let wStream = fs.createWriteStream((path.join(__dirname, '/project-dist/style.css')), {
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

// Create HTML

const readHTML = fs.createReadStream(path.join(__dirname, '/template.html'));

readHTML.on('readable', function () {
  let templateData = readHTML.read();
  if (templateData != null) {
    templateData = templateData.toString();
    let regex = /\{\{(.+?)\}\}/g;

    let component;
    let promises = [];

    while ((component = regex.exec(templateData)) !== null) {
      let componentName = component[1] + '.html';
      let replaceValue = component[0];
    
      let promise = new Promise((resolve) => {
        fs.access(path.join(__dirname, '/components/', componentName), (err) => {
          if (err) {
            console.error(`File ${componentName} does not exist!`);
            resolve();
          } else {
            const readComponent = fs.createReadStream(path.join(__dirname, '/components/', componentName));
            readComponent.on('readable', function () {
              let componentData = readComponent.read();
              if (componentData != null) {
                componentData = componentData.toString();
                templateData = templateData.replace(replaceValue, componentData);
              }
              resolve();
            })
          }
        });
      });
    
      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      let writeHTML = fs.createWriteStream((path.join(__dirname, '/project-dist/index.html')), {
        flags: 'w'
      });
      writeHTML.write(templateData);
      writeHTML.end();
    })

  }
});