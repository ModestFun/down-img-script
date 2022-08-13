const process = require('child_process');
const fs = require('fs-extra');
const ChildProcess = process.fork('./downImgScript.js');

ChildProcess.on('exit', function (code) {
  console.log('process exits + ' + code);
  if (code !== 0) {
    process.fork('./main.js');
  }
});
