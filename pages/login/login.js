// pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setLoginMsg();
  },
  formSubmit: function(e) {
    console.log(e.detail.value.nickname);
    this.login(e.detail.value.nickname, e.detail.value.password)
  },
  setLoginMsg: function() {
    this.setData({
      username: wx.getStorageSync('username'),
      password: wx.getStorageSync('password')
    })
   
  },
  login: function (username, password) {
    var that=this;
    console.log(username);
    wx.setStorageSync('username', username);
    wx.setStorageSync('password', password);
    util.mpNoToastRequest(app, {
      account: username,
      pwd: password
    }, app.url + '/usr/login',function(data){
      console.log(data);
      console.log(data['header']['Set-Cookie'].split(";")[0]);
      // 登录成功，存储用户JSESSIONID
      app.globalData.Cookie = data['header']['Set-Cookie'].split(";")[0];
      app.globalData.userId = data.data.id;

      wx.setStorageSync('temporarySessionId', app.globalData.Cookie);
      wx.navigateBack({
        
      })
    })
  }
  //app.url + '/index/getBrandIndex'
})