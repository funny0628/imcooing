import Oss from "ali-oss";
// const Oss = require('ali-oss');

class OSS {
  constructor(props) {
    this.client = null;
    this.init(props);
  }

  init(props) {
    const client = new Oss(props);

    // {
    //   // 现在先写死了这个 等后端 ststoken方案
    //   endpoint: 'oss-cn-beijing.aliyuncs.com',
    //   accessKeyId: 'LTAIpVlVZkLUgbED',
    //   accessKeySecret: '5SKxRIi1Hw1C2zxgfkSLf24tBCSTJY',
    //   // stsToken: '<Your SecurityToken>',
    //   bucket: 'cooing'
    //   // endpoint: 'oss-cn-shenzhen.aliyuncs.com',
    //   // accessKeyId: 'LTAIX9AYFLpo8BQm',
    //   // accessKeySecret: 'CHwZKstryLksDHtaGqtNil0P8UoEy1',
    //   // bucket: 'm-shop-dev'
    // }

    this.client = client;
  }

  upload(files) {
    const len = files.length;
    const promiseArr = [];
    for (let i = 0; i < len; i++) {
      promiseArr.push(this.uploadSingle(files[i]));
    }
    return Promise.all(promiseArr);
    // var URL = window.URL || window.webkitURL;
    // var imgURL = URL.createObjectURL(file);
  }

  uploadSingle(file) {
    return new Promise((res, rej) => {
      try {
        const reader = new FileReader();
        reader.onload = (file => {
          return e => {
            const result = e.target.result;

            // 获取图片宽高
            const image = new Image();
            image.src = result;
            image.onload = imageEvent => {
              const { width, height } = imageEvent.path[0];
              // 时间戳去拼接文件名
              const fileName = `${Number(new Date())}-${file.name}`;
              this.client
                .put(fileName, this.dataURLtoFile(result))
                .then(() => {
                  //  signatureUrl  这个是授权签名 url 现在没有权限问题 不需要用到
                  // let url = this.client.signatureUrl(file.name); //　　获取上传后的文件地址
                  //

                  // 文件名说没有规则 那就先用 时间戳+原来的文件名
                  // 这个文件名返回给 服务端
                  res({
                    fileName,
                    extension: this.getFileSuffix(file.type),
                    height,
                    width
                  });
                  //
                })
                .catch(function(err) {
                  rej(err);
                });
            };
          };
        })(file);
        reader.readAsDataURL(file);
      } catch (e) {
        rej(e);
      }
    });
  }

  getFileSuffix(fileName) {
    const index = fileName.lastIndexOf("/");
    return fileName.substr(index + 1);
  }

  // //　　转换成二进制
  // dataURItoBlob(dataURI) {
  //   var mimeString = dataURI
  //     .split(',')[0]
  //     .split(':')[1]
  //     .split(';')[0]; // mime类型
  //   var byteString = atob(dataURI.split(',')[1]); //base64 解码
  //   var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  //   var intArray = new Uint8Array(arrayBuffer); //创建视图
  //   for (var i = 0; i < byteString.length; i++) {
  //     intArray[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([intArray], { type: mimeString });
  // }

  //　　转换成二进制
  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}

export default OSS;
