const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const md5 = require("md5");
const salt = 'E=j_Z`$*NxgAOla';
const request = require('request')
const host = process.argv[2];
const downDir = process.argv[3];

const getToken = async () => {
  return jwt.sign({ key: md5(new Date().getHours()) }, salt);
}

const getUnDownImgList = async () => {
  const token = await getToken();
  try {
    const res = await axios.post(`${host}/getUnDownloadImgList`, {
      token
    });
    if (res.data.success) {
      return res.data.imgList;
    }
  } catch (err) {
    console.log(err);
  } finally {
    return [];
  }
}

const runDownLoad = async () => {
  const arr = await getUnDownImgList();
  if (arr.length === 0) {
    return console.log('本轮无文件可下载');
  }
  arr.forEach(item => {
    request(`${host}/downloadImg/${item.id}`, { responseType: 'blob' }).pipe(
      fs.createWriteStream(`${downDir}/${item.id}.jpg`)
        .on('close', err => {
          if (err) return console.log('写入失败');
          console.log(`成功下载${item.id}.jpg`);
        })
    )
  })
}

setInterval(() => {
  runDownLoad();
}, 5000);


