const api = "https://im.xuexice.com/service_url";
// const api = "http://10.99.50.134:19002/service_url";

// 获取 config
const Http = {
  async get(url) {
    const res = await fetch(api);
    return res.json();
  }
};

export default Http;
