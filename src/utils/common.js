
let version,ua = window.navigator.userAgent.toLowerCase();

if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  version = "WXPAY";
} else if (ua.match(/AlipayClient/i) == 'alipayclient') {
  version = "ALIPAY";
} else {
  version = "";
}

export default {
  version,
}

