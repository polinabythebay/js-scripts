"use strict";

var path = require('path');
var walk = require('walk');
var fs = require('file-system');


//all js files for webpack to consume and return css bundles for
var walker = walk.walk("./file/tree");

walker.on("file", function (root, fileStats, next) {
  //if (path.extname(fileStats.name) === '.js') {
  //  //do nothing
  //  console.log("do nothing");
  //} else {
  //
  //  console.log("do something");
  //}
  var baseName = path.basename(fileStats.name, '.less');
  var pathToJSFile = root + '/' + baseName +'.js';
  var data = "require('./" + fileStats.name + "');";
  fs.writeFile(pathToJSFile, data, function (err) {
    if (err) return console.log(err);
    console.log("I am writing a file here:", pathToJSFile);
    console.log("here is my data", data);
    next();
  });
});

walker.on("end", function () {
  console.log("all done");
});