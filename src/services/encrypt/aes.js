// import Crypto from 'crypto-js';
const Crypto = require("crypto-js");
import { local } from "../../utils/lib";

Crypto.enc.u8array = {
  stringify: function(wordArray) {
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    var u8 = new Uint8Array(sigBytes);
    for (var i = 0; i < sigBytes; i++) {
      var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[i] = byte;
    }
    return u8;
  },
  parse: function(u8arr) {
    var len = u8arr.length;
    var words = [];
    for (var i = 0; i < len; i++) {
      words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return Crypto.lib.WordArray.create(words, len);
  }
};

const MODE = Crypto.mode.CBC;
const PADDING = Crypto.pad.Pkcs7;
//  mode  padding 还没未定 不一定是这种 形式的

// const secretKey = '43795dd00d08d927';
// const iv = '295347ffe5f31258';

// let AESKEY = '1';
// let AESIV = '2';

class AES {
  static AESKEY = "";
  static AESKEY = "";

  constructor() {}

  static setAES({ AESKEY, AESIV }) {
    AES.AESKEY = AESKEY;
    AES.AESIV = AESIV;
  }

  /**
   *
   * @description 解密 数据
   * @static
   * @param {*} data  密文
   * @param { Boolean } flag  加密的类型是否为  二进制流
   * @returns {string} 解密的 JSON
   * @memberof AES
   */
  static decode(data, flag) {
    // flag为  二进制流
    // AESkey
    // if (AESkey === '') return false;

    // let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    if (flag) {
      // 接收的是ArrayBuffer
      const u8arrayData = new Uint8Array(data);
      // 将u8array转换成WordArray
      data = Crypto.enc.u8array.parse(u8arrayData);
      // 要求密文是base64格式
      data = data.toString(Crypto.enc.Base64);
    }

    const key = Crypto.enc.Utf8.parse(AES.AESKEY);
    const iv = Crypto.enc.Utf8.parse(AES.AESIV);
    const decrypted = Crypto.AES.decrypt(data, key, {
      iv,
      mode: MODE,
      padding: PADDING
    });
    if (flag) {
      return Crypto.enc.u8array.stringify(decrypted);
    }
    const res = decrypted.toString(Crypto.enc.Utf8);
    return res;
  }

  /**
   * @description 加密
   * @static
   * @param {String} data 需要加密的密文
   * @param { Boolean } flag  加密的类型是否为  二进制流
   * @returns
   * @memberof AES
   */
  static encode(data, flag) {
    // flag true 为arraybuffer
    // flag && (data = Crypto.enc.u8array.parse(data));
    flag && (data = Crypto.enc.u8array.parse(new Uint8Array(data)));
    //
    const key = Crypto.enc.Utf8.parse(AES.AESKEY);
    const iv = Crypto.enc.Utf8.parse(AES.AESIV);
    const ciphertext = Crypto.AES.encrypt(data, key, {
      iv,
      mode: MODE,
      padding: PADDING
    });
    // return CryptoJS.enc.u8array.stringify(encrypted.ciphertext);

    //

    // const arr = Crypto.enc.u8array.stringify(ciphertext.ciphertext);
    //
    // const bf = new ArrayBuffer(arr.length);
    if (flag) {
      //
      return Crypto.enc.u8array.stringify(ciphertext.ciphertext);
    }
    return ciphertext.toString();
  }
}
//{ test: 1, a: 23132 }
// const a = AES.encode('1234', secretKey, iv);
//

// const b = AES.decode(a, secretKey, iv);
//

// const text =
//   'S7G8mrgC36+uPM/BfP0XhLsf4LMCqGWqGowQFFLlrxK0LeAUUnkLvyMGLi8IFcHYI9uqcFki8u16dg80Vcpwfj+wXfTxZ4xuGi39VHbgnn4=';
//
window.Crypto = Crypto;
window.AES = AES;
//
// AES.setAES({ AESKEY: local('AESKEY'), AESIV: local('AESIV') });
export default AES;
