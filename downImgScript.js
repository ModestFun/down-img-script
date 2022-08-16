const axios = require('axios');
const fs = require('fs');
const request = require('request')
const host = 'http://127.0.0.1:8080';

const getUnDownImgList = async () => {
  try {
    const res = await axios.get(`${host}/getUnDownloadImgList`);
    return res.data.imgList;
  } catch (err) {
    console.log(err);
  }
}

const runDownLoad = async () => {
  const arr = await getUnDownImgList();
  if (arr.length === 0) {
    return console.log('本轮无文件可下载');
  }
  arr.forEach(item => {
    request(`${host}/downloadImg/${item.id}`, { responseType: 'blob' }).pipe(
      fs.createWriteStream(`./public/images/${item.id}.jpg`)
        .on('close', err => {
          if (err) return console.log('写入失败');
          console.log(`成功下载${item.id}.jpg`);
        })
    )
  })
}

setInterval(() => {
  runDownLoad();
}, 30000);


