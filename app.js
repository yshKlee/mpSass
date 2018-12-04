//app.js
App({
  onLaunch: function() {
    var that = this;
    //如果有就设置上缓存的session
    if (wx.getStorageSync('temporarySessionId')) {
      this.globalData.Cookie = wx.getStorageSync('temporarySessionId');
    } else {
      wx.removeStorageSync('temporarySessionId')
      // 获取用户位置
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          that.globalData.latitude = res.latitude;
          that.globalData.longitude = res.longitude;
          /**
           * 自动登录
           */
          that.join();
        },
        fail: function(data) {
          console.log(data)
          that.join();
          // wx.showToast({
          //   title: '网络链接超时，请稍后重新尝试！',
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      })
    }
  },

  /**
   * 自动登录
   */
  isMiniWxLogin: function(code, encryptedData, iv, flag) {
    var that = this;
    wx.request({
      url: that.url + '/usr/isMiniWxLogin',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv,
        projectType: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 1) { // code=1, 用户登录成功
          // 登录成功，存储用户JSESSIONID
          that.globalData.Cookie = 'JSESSIONID=' + res.data.resultObj.obj1;
          // 存储自动登录票据
          wx.setStorageSync('AUTO_LOGIN_TICKET', res.data.resultObj.obj2);
          // 获取用户信息
          that.globalData.user = res.data.entity;
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          wx.navigateBack();
        } else if (res.data.code == 2) { // code=2, 用户为绑定手机号, 前往绑定页面
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          // 未绑定，存储用户JSESSIONID
          that.globalData.Cookie = 'JSESSIONID=' + res.data.resultObj;
          if (flag) {
            return;
          }
          wx.navigateTo({
            url: '/pages/me/phoneLogin/phoneLogin',
          })
        } else if (res.data.code == 3) { // code=3, code已经过期, 需要重新微信授权
          wx.showToast({
            title: '用户登录已过期，请重新登录',
            icon: 'none',
            duration: 1000
          })
          var pages = getCurrentPages();
          var page = pages[pages.length - 1];
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          if (flag || page.route.indexOf('wxLogin') != -1) {
            return;
          }
          wx.navigateTo({
            url: '/pages/me/wxLogin/wxLogin',
          })
        } else {
          wx.showToast({
            title: '用户登录已过期，请重新登录',
            icon: 'none',
            duration: 1000
          })
          var pages = getCurrentPages();
          var page = pages[pages.length - 1];
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          if (flag || page.route.indexOf('wxLogin') != -1) {
            return;
          }
          wx.navigateTo({
            url: '/pages/me/wxLogin/wxLogin',
          })
        }

      },
      fail: function() {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '网络链接超时，请稍后重新尝试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 自动登录
   */
  join: function() {
    var that = this;
    wx.request({
      url: that.url + '/usr/join',
      data: {
        longitude: that.globalData.longitude,
        latitude: that.globalData.latitude,
        cityCode: that.globalData.cityCode
      },
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'Cookie': 'AUTO_LOGIN_TICKET="' + wx.getStorageSync('AUTO_LOGIN_TICKET') + '";'
      },
      success: function(res) {
        if (res.data.success) {
          // 登录成功，存储用户JSESSIONID
          that.globalData.Cookie = 'JSESSIONID=' + res.data.resultObj;
          that.globalData.userId = res.data.entity.id;
          // 获取用户信息
          that.getUserInfo();
        } else {
          wx.removeStorageSync("userWxMiniProgramBCode");
          //未登录状态 跳转
          wx.navigateTo({
            url: '/pages/login/login',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
          // that.isAuthorize(true);
        }

      },
      fail: function(data) {
        console.log(data)
        wx.showToast({
          title: '网络链接超时，请稍后重新尝试！',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function() {
    var that = this;
    wx.request({
      url: that.url + "/my/info/userIndex",
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'Cookie': that.globalData.Cookie
      },
      success: function(res) {
        // 存储用户信息到本地
        var user = res.data;
        if (null != user && user instanceof Object) {
          that.globalData.user = user;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    Cookie: '',
    user: null,
    cityCode: '',
    latitude: '30.25961',
    longitude: '120.13026',
    storeList: []
  },
  url: "https://www.heyqun.net/7life-store",
  // url: "https://www.heyqun.com.cn/7life-store",
  // imgUrl: "https://www.heyqun.net/7life-store",
  imgUrl: "https://www.heyqun.com.cn/7life-store",
})