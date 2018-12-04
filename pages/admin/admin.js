// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toCard:function(){
    wx.navigateTo({
      url: '/pages/order/card/card',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toCourse: function () {
    wx.navigateTo({
      url: '/pages/order/course/course',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toCourseList: function () {
    wx.navigateTo({
      url: '/pages/courselist/course/course',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})