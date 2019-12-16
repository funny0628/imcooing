const CreateECDH = require("./browser");
import AES from "./aes";

import { stob64, hextob64, b64utohex, stohex } from "jsrsasign";
// window.hextob64 = hextob64;
// window.b64utohex = b64utohex;
// window.stohex = stohex;
// window.stob64 = stob64;

class ECDH {
  constructor() {
    // this.ec = null; // ecdh 实例对象
    this.pubKey = null;
    this.priKey = null;
    // 客户端实例
    this.clientKeyInstance = null;
    // this.serverKeyInstance = null;
    this.init();
  }

  init() {
    // 创建客户端实例
    const ECDH = CreateECDH("secp256r1");
    // 生成客户端 key
    ECDH.generateKeys("hex");
    const pubKey = ECDH.getPublicKey("hex", "compressed");
    //
    this.clientKeyInstance = ECDH;
    // 生成的公钥是 hex
    // 转成 base64
    this.pubKey = hextob64(pubKey);
    this.priKey = ECDH.getPrivateKey("hex");
  }

  /**
   * @description 根据服务端公钥  得到aes key iv
   * @param {*} sPubKeyBase64
   * @returns { AESKEY , AESKEY}
   * @memberof ECDH
   */
  getAESInfo(sPubKeyBase64) {
    // 转成 hex
    const hexServicePubKey = b64utohex(sPubKeyBase64);

    // 计算 得到一串 新的秘钥
    const res = this.clientKeyInstance.computeSecret(
      hexServicePubKey,
      "hex",
      "hex"
    );

    // 得到的res 前16是 AES的key  最后16是 AES的IV
    const AESKEY = res.substr(0, 16);
    const AESIV = res.substr(res.length - 16);

    // 设置aes key iv
    AES.setAES({ AESKEY, AESIV });

    return {
      AESKEY,
      AESIV
    };
  }
}

export default ECDH;
