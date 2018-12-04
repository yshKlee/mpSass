// pages/card/card.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [{
      id: '',
      name: '全部'
    }, {
      id: 3,
      name: '已过期'
    }, {
      id: 1,
      name: '有效' //可用
    }, {
      id: 0,
      name: '无效'
    }],
    page: 0,
    hasNext: true,
    list: [],
    index: 0,
    startTime: util.dateFormat(new Date(), "Y-M-D"),
    value: '',
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrder();
    return;
    wx.showModal({
      title: '提示',
      content: '111',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getOrder: function() {
    var that = this;
    util.mpNoToastRequest(app, {
      size: 10,
      page: that.data.page,
      startTime: that.data.startTime,
      status: that.data.array[that.data.index].id,
      nickname: that.data.value //改成 nickname
    }, app.url + '/admin/courseCard/getAllUserCards', function(res) {
      //console.log(res.data);
      var newList = res.data.content.map(function(item, full) {
        //为图片formate
        return Object.assign(item, {
          index: full,
          cardType: that.statusFormater(item.status)
        })
      })
      that.setData({
        list: that.data.list.concat(newList),
        hasNext: (res.data.content.length <= 0 ? false : true)
      })
    })
  },
  resetPage: function() {
    this.setData({
      page: 0,
      hasNext: true,
      list: []
    })
  },
  bindDateChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
    this.getOrder();
  },
  cancelInput: function() {
    this.setData({
      value: ''
    })
  },
  bindPickerChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    //重置分页和数据
    this.resetPage();
    this.getOrder();
  },
  setInputVal: function(e) { //文字搜索更改监听
    this.setData({
      value: e.detail.value
    })
    //重置分页和数据
    this.resetPage();
    this.getOrder();
  },
  statusFormater: function(value) {
    var textName = '其他';
    switch (value) {
      case 0:
        textName = '无效';
        break;
      case 1:
        textName = '有效'; //可用
        break;
      case 3:
        textName = '已过期'; //过期
        break;
      default:
        break;
    }
    return textName;
  },
  showAction: function() {
    console.log(1);
    this.setData({
      modalHidden: false,
    })
  },
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true,
    })
  },
  modalConfirm: function() {
    // do something
    this.setData({
      modalHidden: true,
    })
  },
  onReachBottom: function(e) {
    if (this.data.hasNext) {
      this.setData({
        page: this.data.page + 1
      })
      this.getOrder();
    }
  }
})