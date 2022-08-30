const childProcess = require('child_process');
let host = process.argv[2] && process.argv[2].split('=')[1] || 'http://127.0.0.1:8080'
let downDir = process.argv[3] && process.argv[3].split('=')[1] || './public/images'

// 获取环境变量中的host
// process.argv.forEach((val) => {
//   if (val.indexOf('CONFIG_HOST=') !== -1) {
//     const configHost = val.split('CONFIG_HOST=').reverse()[0];
//     if (configHost && configHost.length > 0) {
//       host = configHost;
//     }
//   }
//   if (val.indexOf('DOWNLOAD_DIR=') !== -1) {
//     const configDir = val.split('DOWNLOAD_DIR=').reverse()[0];
//     if (configDir && configDir.length > 0) {
//       downDir = configDir;
//     }
//   }
// })

const ChildProcess = childProcess.fork('./downImgScript.js', [host, downDir]);

ChildProcess.on('exit', (code) => {
  console.log('process exits + ' + code);
  if (code !== 0) {
    childProcess.fork('./main.js', [`CONFIG_HOST=${host}`, `DOWNLOAD_DIR=${downDir}`]);
  }
});
