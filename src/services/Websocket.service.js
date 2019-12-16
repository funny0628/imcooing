import dataSource from "../dataSource";
import MessageService from "../services/Message.service";
import { session } from "../utils/lib";
class WebsocketService {
  constructor({ url, timeout, reconnect }) {
    this.url = url;
    this.ws = null;
    this.timer = null;
    this.timeout = timeout;
    this.reconnect = reconnect;
  }
  init = () => {
    return new Promise(resolve => {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = "arraybuffer";
      this.ws.onopen = () => {
        this.initEventHandle();
        resolve(this.ws);
      };
    });
  };
  initEventHandle = () => {
    this.ws.onmessage = this.onmessage;
    this.ws.onclose = this.onclose;
    this.ws.reset = this.reset;
    this.ws.start = this.start;
  };
  // 发送
  send = msg => {
    //
    this.ws.send(msg);
  };
  // 接收
  onmessage = e => {
    // 重置心跳检测
    // this.reset().start();
  };
  // 断开
  onclose = e => {
    // 断开重连
    this.reconnect();
  };
  // // 重连
  // reconnect = () => {
  //   // this.init();
  //   // this.re
  // };
  // 重置
  reset = () => {
    clearTimeout(this.timer);
    this.timer = null;
    return this;
  };
  // 心跳检测
  start = () => {
    const data = dataSource[10001001].body;
    const buf = MessageService.set(parseInt(10001001, 16), data);
    this.timer = setTimeout(() => {
      // if (!session("sessionId")) return (this.timer = null);
      this.ws.send(buf);
    }, this.timeout);
  };
}

export default WebsocketService;
