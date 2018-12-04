const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
const dateFormat = (number, format) => {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const mpRequest = (app, requestData, requestUrl, callback) => {
  wx.request({
    url: requestUrl,
    data: requestData,
    header: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Cookie': app.globalData.Cookie
    },
    success: function(res) {
      if (res.data.success) {
        callback(res.data);
      } else {
        //console.log(res.data);
        wx.showToast({
          title: '网络链接超时，请稍后重新尝试！',
          icon: 'none',
          duration: 2000
        })
      }

    },
    fail: function(data) {
      console.log(data)
      wx.showToast({
        title: '网络链接超时，请稍后重新尝试！',
        icon: 'none',
        duration: 2000
      })
    },
    complete: function (res) {
      
      wx.hideNavigationBarLoading();
    }
  })
}
const mpNoToastRequest = (app, requestData, requestUrl, callback) => {
  wx.request({
    url: requestUrl,
    data: requestData,
    header: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Cookie': app.globalData.Cookie
    },
    success: function(res) {
      callback(res);
    },
    fail: function(data) {
      console.log(data)
      wx.showToast({
        title: '网络链接超时，请稍后重新尝试！',
        icon: 'none',
        duration: 2000
      })
    },
    complete: function(res) {
      if (res.data === "REDIRECT") {
        wx.removeStorageSync('temporarySessionId');
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
      wx.hideNavigationBarLoading();
    }
  })
}
module.exports = {
  formatTime: formatTime,
  heyqunRequest: mpRequest,
  dateFormat,
  mpNoToastRequest
}