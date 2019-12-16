import DataViewService from "./DataView.service";
import format from "../utils/msg.format";
import dataSource from "../dataSource";
import JSBI from "jsbi";
import AES from "./encrypt/aes";
// require('fast-text-encoding');

// 不需要解密的命令字
const DECRYPTION = [10008001, 10008003, 10008004];

// 不需要加密的命令字
const ENCRYPTION = [10001001, 10001003, 10001004];

// 包头长度
const HEADLEN = 14;
// 包尾长度
const FOOTLEN = 1;
const MessageService = {
  // 获取消息
  get(data) {
    const dv = DataViewService.get(data);
    const {
      getMsgHeader,
      getMsgBody,
      getBaseResponse,
      getMsgFooter,
      capitalLetter
    } = format;
    // 消息处理  这里改了一下    新增 第三个参数 dv (因为处理加密的 dv 不一样)
    function msgHandle(msg, offset, dv) {
      msg.forEach(item => {
        // 数组...
        if (item.isArray) {
          const arrLen = dv.getUint32(offset, true);
          // 如果数据长度大于0
          if (arrLen) {
            offset += 4;
            const { result, oft } = format.fmtResArrStream(
              dv,
              arrLen,
              offset,
              item.itemStruct,
              msgHandle
            );
            item.value = result;
            offset = oft;
          } else {
            item.value = [];
          }
        } else if (item.type === "string") {
          // 4个字节 得到字符串长度
          const strlen = dv.getUint32(offset, true);
          offset += 4;
          // 获取字符串
          const { res, oft } = format.fmtResStrStream(dv, strlen, offset);
          offset = oft;
          // 发送时加了一个字节补0,所以接收时过滤偏移1
          offset += 1;
          item.value = res;
        } else {
          const value = dv[`get${capitalLetter(item.type)}`](offset, true);
          item.value = value;
          offset += item.size;
        }
      });
      return {
        res: msg,
        offset
      };
    }
    let offset = 0;
    // 处理包头
    const headerRes = msgHandle(getMsgHeader(), offset, dv);
    offset = headerRes.offset;
    // 通过解析命令字 找出具体要解析的包体
    const cmdID = headerRes.res.find(item => item.id === "cmdID");
    const { body, action } = dataSource[cmdID.value.toString(16)];

    // 需要解密    加密新加的
    if (!DECRYPTION.includes(Number(cmdID.value.toString(16)))) {
      //

      // 需要解密的包体
      const _body = [
        ...getMsgBody(cmdID.value),
        ...getBaseResponse(cmdID.value),
        ...body
      ];
      // 只有包体需要密文   截取包体
      const cipher = data.slice(headerRes.offset, data.byteLength - FOOTLEN);
      // 解密后的 uint8array
      const decryptedBody = AES.decode(cipher, true);
      //
      // const res = msgHandle(_body, offset);
      //
      //
      // 需要重新 算一个 包体的  dv
      const bodyDv = DataViewService.create(decryptedBody.length);
      // bodyDv
      // 将 加密的 uint8 填充到 bodydv
      decryptedBody.forEach((v, i) => {
        bodyDv.setUint8(i, v);
      });
      //

      const headOffset = 0;
      const bodyRes = msgHandle(_body, headOffset, bodyDv);
      //

      // 处理 包尾
      const foot = [...getMsgFooter()];
      const footRes = msgHandle(foot, offset, dv);
      //

      // 包头 包体  包尾合并
      const Res = [...headerRes.res, ...bodyRes.res, ...footRes.res];
      const result = Res.reduce(
        (a, { id, value }) => ({ ...a, [id]: value }),
        {}
      );
      return {
        result,
        action
      };
    }

    // 处理包体包尾
    const common = [
      ...getMsgBody(cmdID.value),
      ...getBaseResponse(cmdID.value),
      ...body,
      ...getMsgFooter()
    ];
    const commonRes = msgHandle(common, offset, dv);
    offset = commonRes.offset;
    const Res = [...headerRes.res, ...commonRes.res];
    // 格式化结果
    const result = Res.reduce(
      (a, { id, value }) => ({ ...a, [id]: value }),
      {}
    );
    return {
      result,
      action
    };
  },
  // 设置消息
  set(cmdID, body = []) {
    // 需要加密
    if (!ENCRYPTION.includes(Number(cmdID.toString(16)))) {
      //
      return this.encode(cmdID, body);
    }

    const { getMsgHeader, getMsgBody, getMsgFooter, capitalLetter } = format;
    // 计算流长度
    const dataSize = [
      ...getMsgHeader(),
      ...getMsgBody(cmdID),
      ...body,
      ...getMsgFooter()
    ].reduce((a, b) => a + b.size, 0);
    // 创建DataView
    const dv = DataViewService.create(dataSize);
    // 数据
    const data = [
      ...getMsgHeader(cmdID, dataSize),
      ...getMsgBody(cmdID),
      ...body,
      ...getMsgFooter()
    ];
    //
    // 初始化偏移量
    let offset = 0;
    // 创建数据流
    var _str = "";
    data.map(item => {
      if (item.type === "string") {
        _str += item.value;
        offset = format.fmtReqStrStream(dv, item.value, offset);
      } else {
        if (item.type === "uint64") {
          _str += JSBI.BigInt(item.value || 0);
          dv.setUint64(
            offset,
            item.value ? JSBI.BigInt(item.value) : JSBI.BigInt(0),
            true
          );
        } else {
          _str += item.value || 0;

          dv[`set${capitalLetter(item.type)}`](
            offset,
            item.value ? item.value : 0,
            true
          );
        }
        offset += item.size;
      }
    });
    return dv.buffer;
  },

  encode(cmdID, body = []) {
    const { getMsgHeader, getMsgBody, getMsgFooter, capitalLetter } = format;

    // 计算 包体
    const _body = this.computeBody(cmdID, body);
    //
    // 包体加密
    const bodyEncode = AES.encode(_body.dv.buffer, true);

    //
    //  计算包尾巴
    const foot = this.computeFoot(cmdID, body);
    //
    // 计算包头
    const head = this.computeHead(
      cmdID,
      body,
      bodyEncode.length + HEADLEN + FOOTLEN
    );
    //

    const dataSize =
      head.dv.byteLength + bodyEncode.length + foot.dv.byteLength;
    //

    //

    //

    const uint8data = new Uint8Array(dataSize);
    // 将 14 个包头 填充到 uint8data
    for (let i = 0; i < HEADLEN; i++) {
      uint8data[i] = head.dv.getUint8(i);
      //
    }
    // 将  加密后的 包体 填充到 uint8data
    for (let i = 0; i < bodyEncode.length; i++) {
      uint8data[i + HEADLEN] = bodyEncode[i];
      // i < 5 &&
      //
    }
    // 将  加密后的 包尾 填充到 uint8data
    //
    for (let i = 0; i < foot.dv.byteLength; i++) {
      //
      uint8data[i + HEADLEN + bodyEncode.length] = foot.dv.getUint8(i);
      //
    }
    //
    //
    //
    //
    // const a = new ArrayBuffer(dataSize);
    // const b = new DataView(a);
    // uint8data.forEach((v, i) => {
    //   b.setUint8(i, v);
    // });
    //
    // return b.buffer;
    //
    return uint8data;
  },

  computeHead(cmdID, body = [], dataSize) {
    const { getMsgHeader, capitalLetter } = format;
    // 创建DataView
    const dv = DataViewService.create(14);
    // 数据
    const data = [...getMsgHeader(cmdID, dataSize)];
    // 初始化偏移量
    let offset = 0;

    // 创建数据流
    return this.fillDataView(dv, data, offset);
  },
  computeBody(cmdID, body = []) {
    //
    const { getMsgBody } = format;
    const dataSize = [...getMsgBody(cmdID), ...body].reduce(
      (a, b) => a + b.size,
      0
    );
    // 创建DataView
    const dv = DataViewService.create(dataSize);
    // 数据
    const data = [...getMsgBody(cmdID), ...body];
    // 初始化偏移量
    let offset = 0;

    // 创建数据流
    return this.fillDataView(dv, data, offset);
  },
  computeFoot() {
    const { getMsgFooter } = format;
    const dataSize = [...getMsgFooter()].reduce((a, b) => a + b.size, 0);
    // 创建DataView
    const dv = DataViewService.create(dataSize);
    // 数据
    const data = [...getMsgFooter()];
    // 初始化偏移量
    let offset = 0;
    // 创建数据流

    return this.fillDataView(dv, data, offset);
  },
  // 填充 dataview 抽离公共的方法
  fillDataView(dv, data, offset) {
    const { capitalLetter } = format;
    data.map(item => {
      if (item.type === "string") {
        offset = format.fmtReqStrStream(dv, item.value, offset);
      } else {
        if (item.type === "uint64") {
          dv.setUint64(
            offset,
            item.value ? JSBI.BigInt(item.value) : JSBI.BigInt(0),
            true
          );
        } else {
          dv[`set${capitalLetter(item.type)}`](
            offset,
            item.value ? item.value : 0,
            true
          );
        }
        offset += item.size;
      }
    });

    return { dv, offset };
  }
};

export default MessageService;
