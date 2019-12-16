import { session } from "./lib.js";
require("fast-text-encoding");

const format = {
  // *** 流转字符串
  binayUtf8ToString(buf, begin) {
    let i = 0;
    let pos = 0;
    let str = "";
    let unicode = 0;
    let flag = 0;
    for (pos = begin; pos < buf.length; ) {
      // new TextEncoder().encode(buf[pos]);
      flag = buf[pos];
      if (flag >>> 7 === 0) {
        str += String.fromCharCode(buf[pos]);
        pos += 1;
      } else if ((flag & 0xfc) === 0xfc) {
        unicode = (buf[pos] & 0x3) << 30;
        unicode |= (buf[pos + 1] & 0x3f) << 24;
        unicode |= (buf[pos + 2] & 0x3f) << 18;
        unicode |= (buf[pos + 3] & 0x3f) << 12;
        unicode |= (buf[pos + 4] & 0x3f) << 6;
        unicode |= buf[pos + 5] & 0x3f;

        str += String.fromCharCode(unicode);
        pos += 6;
      } else if ((flag & 0xf8) === 0xf8) {
        unicode = (buf[pos] & 0x7) << 24;
        unicode |= (buf[pos + 1] & 0x3f) << 18;
        unicode |= (buf[pos + 2] & 0x3f) << 12;
        unicode |= (buf[pos + 3] & 0x3f) << 6;
        unicode |= buf[pos + 4] & 0x3f;

        str += String.fromCharCode(unicode);
        pos += 5;
      } else if ((flag & 0xf0) === 0xf0) {
        unicode = (buf[pos] & 0xf) << 18;
        unicode |= (buf[pos + 1] & 0x3f) << 12;
        unicode |= (buf[pos + 2] & 0x3f) << 6;
        unicode |= buf[pos + 3] & 0x3f;
        if (unicode > 40869) {
          str += String.fromCodePoint(unicode);
        } else {
          str += String.fromCharCode(unicode);
        }
        pos += 4;
      } else if ((flag & 0xe0) === 0xe0) {
        unicode = (buf[pos] & 0x1f) << 12;
        unicode |= (buf[pos + 1] & 0x3f) << 6;
        unicode |= buf[pos + 2] & 0x3f;
        str += String.fromCharCode(unicode);
        pos += 3;
      } else if ((flag & 0xc0) === 0xc0) {
        //110
        unicode = (buf[pos] & 0x3f) << 6;
        unicode |= buf[pos + 1] & 0x3f;
        str += String.fromCharCode(unicode);

        pos += 2;
      } else {
        str += String.fromCharCode(buf[pos]);
        pos += 1;
      }
    }
    return str;
  },
  /**
   *字符串转10进制
   *
   * @param {*} str 字符串
   * @returns 10进制数组
   */
  str2decimal(str) {
    const hex = [];
    for (let i = 0; i < str.length; i++) {
      // 汉字
      if (/[\u4E00-\u9FA5]/i.test(str[i])) {
        const s = encodeURI(str[i])
          .split("%")
          .slice(1)
          .map(item => parseInt(item, 16));
        hex.push(...s);
      }
      // 字符串
      else {
        const s = Number(str.charCodeAt(i));
        hex.push(s);
      }
    }
    return hex;
  },

  /**
   *10进制转字符串
   *
   * @param {*} decimal 10进制
   * @returns 字符串
   */
  decimal2str(decimal) {
    // 19968, 40869
    // >=128
    const str = [];
    const list = decimal;
    return this.binayUtf8ToString(list, 0);
    for (let i = 0; i < list.length; i++) {
      // 汉字
      if (list[i] >= 128) {
        str.push(
          decodeURI(
            `%${list[i].toString(16)}%${list[i + 1].toString(16)}%${list[
              i + 2
            ].toString(16)}`
          )
        );
        i += 2;
      } else {
        str.push(String.fromCharCode(list[i]));
      }
    }
    return str.join("");
  },
  /**
   * 首字母大写
   *
   * @param {*} str 字符串
   * @returns 字符串
   */
  capitalLetter(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
  },
  /**
   *处理响应数组流
   *
   * @param {*} dv dataview
   * @param {*} len 数组长度
   * @param {*} oft 偏移
   * @param {*} item item结构体
   * @hander {*} hander 处理item结构体
   * @returns 结果和偏移
   */
  fmtResArrStream(dv, len, oft, item, hander) {
    let result = [];
    for (let i = 0; i < len; i++) {
      const { res, offset } = hander(item, oft, dv);
      oft = offset;
      result.push(JSON.parse(JSON.stringify(res)));
    }
    return {
      result,
      oft
    };
  },
  /**
   *处理响应字符串流
   *
   * @param {*} dv dataview
   * @param {*} str 字符串
   * @param {*} offset 偏移
   * @returns 结果和偏移
   */
  fmtResStrStream(dv, len, offset) {
    const strlen = len - 1;
    const res = new TextDecoder("utf-8").decode(
      new DataView(dv.buffer, offset, strlen)
    );
    offset += strlen;
    return {
      oft: offset,
      res
    };

    // const strlen = len - 1,
    //   box = [];
    // for (let i = 0; i < strlen; i++) {
    //   box.push(dv.getUint8(offset, true));
    //   offset += 1;
    // }

    // const _res = new TextDecoder('utf-8').decode(new DataView(dv.buffer, 0, box.length));
    // return;
    return {
      oft: offset,
      res: this.decimal2str(box)
    };
  },
  /**
   *处理请求字符串流
   *
   * @param {*} dv dataview
   * @param {*} str 字符串
   * @param {*} offset 偏移
   * @returns 偏移
   */
  fmtReqStrStream(dv, str, offset) {
    // const list = this.str2decimal(str);

    // 先用4个字节 填充字符串长度
    const res = new TextEncoder().encode(str);
    dv.setUint32(offset, Number(res.length + 1), true);

    offset += 4;
    res.forEach((v, i) => {
      dv.setUint8(offset, v, true);
      offset += 1;
    });
    // 填充字符串
    // list.map(item => {
    //   dv.setUint8(offset, item, true);
    //   offset += 1;
    // });

    // 最后补一个字节
    dv.setUint8(offset, 0, true);
    offset += 1;
    return offset;
  },

  /**
   * 获取字符串流大小
   *
   * @param {*} str 字符串
   * @returns 长度
   */
  strStreamSize(str) {
    // 5为 （4个字节 填充字符串长度+1哥字节 填充0）

    const res = new TextEncoder().encode(str);
    return res.length + 5;

    let len = 5;
    str.split("").map(item => {
      // 汉字三个字节
      if (/[\u4E00-\u9FA5]/i.test(item)) {
        len += 3;
      }
      // 其他一个字节
      else {
        len += 1;
      }
    });
    return len;
  },
  /**
   * 获取默认包头
   *
   * @param {number} [cmdID=0] 命令字
   * @param {number} [dataSize=0] 数据大小
   * @returns 包头
   */
  getMsgHeader(cmdID = 0, dataSize = 0) {
    const header = [
      // 包头
      {
        id: "STX",
        type: "uint8",
        size: 1,
        //0x43 是 IOS，0x53 是安卓，0x63 用来标识 web端
        value: 99
      },
      {
        id: "pad",
        type: "uint8",
        size: 1,
        value: 255
      },
      {
        id: "dataSize",
        type: "uint32",
        size: 4,
        value: dataSize
      },
      {
        id: "crc",
        type: "uint32",
        size: 4
      },
      {
        id: "cmdID",
        type: "uint32",
        size: 4,
        value: cmdID
      }
    ];
    return header;
  },
  /**
   *获取默认包体
   *
   */
  getMsgBody(cmdID) {
    // 心跳检测接口不需要默认包体(发送命令字:10001001,接收命令字:10008001)
    if ([parseInt(10001001, 16), parseInt(10008001, 16)].includes(cmdID))
      return [];
    const body = [
      {
        id: "sessionId",
        type: "uint64",
        size: 8,
        value: Number(session("sessionId"))
      },
      {
        id: "messageSeq",
        type: "uint64",
        size: 8,
        value: ""
      },
      {
        id: "deviceId",
        type: "uint64",
        size: 8,
        value: ""
      },
      {
        id: "uin",
        type: "uint64",
        size: 8,
        value: Number(session("uin"))
      },
      {
        id: "version",
        type: "uint8",
        size: 1,
        value: ""
      }
    ];
    return body;
  },
  /**
   *  默认包尾
   *
   * @returns
   */
  getMsgFooter() {
    return [
      {
        id: "ETX",
        type: "uint8",
        size: 1,
        value: 0
      }
    ];
  },
  /**
   *  基本响应信息
   *
   * @returns
   */
  getBaseResponse(cmdID) {
    // 心跳检测接口不需要默认包体(接收命令字:10008001)
    // 第一次握手 接口不需要默认包体（错误信息包体 ClientPkgBodyBaseResp 命令字 10008003）
    // 第二次确认握手 接口不需要默认包体（错误信息包体 ClientPkgBodyBaseResp 命令字 10008004）
    if (
      [
        parseInt(10008001, 16),
        parseInt(10008003, 16),
        parseInt(10008004, 16)
      ].includes(cmdID)
    )
      return [];
    return [
      {
        id: "errorCode",
        type: "int32",
        size: 4
      },
      {
        id: "message",
        type: "string"
      }
    ];
  }
};

export default format;
