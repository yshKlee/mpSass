//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userStoreList: [],
    storeIndex: 0,
    dataBoard: null //数据看板
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {

  },
  onShow: function() {
    if (wx.getStorageSync('temporarySessionId')){
      this.getDataBoard();
      this.getUserStore();
    }
  },
  getUserStore() {
    var that = this;
    util.mpNoToastRequest(app, {}, app.url + '/admin/course/getUserStore', function(res) {
      console.log(res);
      that.setData({
        userStoreList: res.data
      })
    })
  },
  getDataBoard: function() {
    var that = this;
    util.heyqunRequest(app, {
      startTime: util.dateFormat(new Date(), "Y-M-D")
    }, app.url + '/admin/order/getAllTypeOrderNum', function(res) {
      //计算总收入
      res.entity.totalMoney = res.entity.totalCourse +
        res.entity.totalPtOrder +
        res.entity.totalEtOrder +
        res.entity.totalCrossOrder +
        res.entity.totalCard;
      that.setData({
        dataBoard: res.entity
      })
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  toExplain:function(){
    wx.navigateTo({
      url: '../explain/explain',
    })
  }
})