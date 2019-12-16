import NodeRSA from "node-rsa";
// import { stob64u } from 'jsrsasign';

// const NodeRSA = require('node-rsa');
// const { stob64u } = require('jsrsasign');

class RSA {
  constructor() {
    this.rsa = null; // 实例对象
    this.pubKey = ""; // 公钥
    this.prvKey = ""; // 私钥

    this.createRSAKeys();
  }

  getPubKey() {
    return this.pubKey;
  }

  getPrvKey() {
    return this.prvKey;
  }

  // 创建RSA密钥对
  createRSAKeys() {
    // 生成密钥对
    this.rsa = new NodeRSA({ b: 1024 });
    // 获取公钥
    const pub = this.rsa.exportKey("public");
    // 获取私钥
    const prv = this.rsa.exportKey("private");

    // base64 编码
    // this.pubKey = stob64u(pub);
    this.pubKey = pub;
    this.prvKey = prv;

    //
  }

  /**
   * @description 解密
   * @param { String }} { cipher } 密文
   * @returns { String } 解密后的字符串
   * @memberof RSA
   */
  decode({ cipher }) {
    const result = this.rsa.decrypt(cipher, "utf8");
    return result;
  }
}

export default RSA;
