import { message } from "antd";
export const validLogin = body => {
  // 校验登录参数 全部通过返回true

  const {
    type,
    phone, //输入的手机号码
    msgCode, //短信验证码
    password
  } = body;
  if (type === "sms") {
    if (phone.length < 6 || msgCode.length !== 4) {
      message.warning("帐号或短信验证码错误");
      return false;
    }
  } else {
    if (phone.length < 6 || password.length === 0) {
      message.warning("帐号或密码错误");
      return false;
    }
  }
  return true;
};
export const getBtnActive = (flag, body) => {
  if (flag) {
    return body.mobileNumber && body.msgCode;
  } else {
    return body.mobileNumber && body.verifyPassword;
  }
};
