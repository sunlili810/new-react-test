const map = {
  1: '未知错误!',
  2: '参数格式错误!',
  257: '用户名或密码错误!',
  513: '设备编号已存在!',
  1011: '刷新过于频繁，请稍后重试',
  1012: '请求超时'
};

export default function errorCode(code) {
  return map[code];
}
