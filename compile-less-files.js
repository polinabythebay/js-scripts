'use strict';
let less = require('less');
let fs = require('file-system');
let walk = require('walk');
let path = require('path');

let SEARCH_PATHS = [];
let SOURCE_DIR = '';
let TARGET_DIR = '';

let options = {
  paths: SEARCH_PATHS,
  filename: '',     // Specify a filename for better error messages
  outputDir: '.',
  //compress: true  // Minify CSS output
};

let walker = walk.walk(SOURCE_DIR);

walker.on('file', (root, file, next) => {

  let directory = TARGET_DIR + root.split(path.sep).slice(4).join("/");
  let targetPath = path.join(__dirname, path.format({ dir: directory, base: file.name }));

  if (path.extname(file.name) === '.less') {
    let fileName = `${root}/${file.name}`;
    options.filename = fileName;

    fs.readFile(fileName, (error, data) => {
      if (error) {
        console.error("Cannot read file:", fileName);
        throw error;
      }
      let dataString = data.toString();

      less.render(dataString, options)
        .then(function(output) {
            fs.writeFile(targetPath, output.css, (error) => {
              if (error) {
                console.error("Cannot write file:", targetPath);
                throw error;
              }
              next();
            });
          },
          function(error) {
            console.log('============ LESS STYLESHEET ERROR ============================================');
            console.log(error);
            next();
          });
    });
  } else {
    console.log('This is not a less file, what is it doing here?', file.name);
    next();
  }
});
