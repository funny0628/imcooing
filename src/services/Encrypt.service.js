import NodeRSA from "node-rsa";
import { stob64u } from "jsrsasign";
import Crypto from "crypto-js";

let AESkey = "";
class Encrypt {
  constructor() {
    //  RSA公钥
    this.pubKey = "";
    //  RSA私钥
    this.prvKey = "";
    //  AES密钥
    this.key = "";
    //  AES密钥偏移量
    this.iv = "";
    this.encrypt = null; // 实例对象
    //  创建RSA密钥对
    this.createRSAKeys();
  }

  // 创建RSA密钥对
  createRSAKeys() {
    // 生成密钥对
    this.encrypt = new NodeRSA({ b: 1024 });
    // //  获取公钥
    const pub = this.encrypt.exportKey("public");
    // //  获取私钥
    const prv = this.encrypt.exportKey("private");

    // // base64 编码
    this.pubKey = stob64u(pub);
    this.prvKey = prv;
  }

  //  解密 AES密钥 返回一个 AES秘钥
  decKey({ cipher }) {
    const result = this.encrypt.decrypt(cipher, "utf8");

    this.setAesKeys({ key: result });

    return result;
  }

  //  Aes 密钥配置
  setAesKeys({ key }) {
    this.key = key;
    AESkey = key;
  }

  //  解密 数据
  static deData(data, IV) {
    if (AESkey === "") return false;
    const KEY = AESkey;
    const key = Crypto.enc.Utf8.parse(KEY);
    const iv = Crypto.enc.Utf8.parse(IV);
    const decrypted = Crypto.AES.decrypt(data, key, {
      iv,
      mode: Crypto.mode.CBC,
      padding: Crypto.pad.Pkcs7
    });
    const res = JSON.parse(decrypted.toString(Crypto.enc.Utf8));
    return res;
  }
}
window.test3 = Encrypt;
export default Encrypt;
