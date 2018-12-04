// pages/order/course/course.js
const app = getApp()
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{
      id: '',
      name: '全部状态'
    }, {
      id: 1,
      name: '待付款'
    }, {
      id: 2,
      name: '用户取消'
    }, {
      id: 3,
      name: '付款成功' //已支付
    }, {
      id: 5,
      name: '已完成'
    }, {
      id: 6,
      name: '超时关闭'
    }, {
      id: 7,
      name: '取消'
    }],
    index: 0, //状态选择的index
    page: 0, //分页
    list: [],
    startTime: util.dateFormat(new Date(), "Y-M-D"),
    value: '',
    modalHidden: true,
    needLoadData: false,
    hasNext: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCourseOrder();
  },
  onShow: function() {
    if (this.data.needLoadData) {
      this.getCourseOrder();
    }
  },
  resetPage: function() {
    this.setData({
      page: 0,
      hasNext: true,
      list: []
    })
  },
  getCourseOrder: function() {
    var that = this;
    util.mpNoToastRequest(app, {
      size: 10,
      page: that.data.page,
      startTime: that.data.startTime,
      endTime: that.data.startTime,
      status: that.data.array[that.data.index].id,
      nickname: that.data.value //改成 nickname
    }, app.url + '/admin/course/orderAll', function(res) {
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
  setInputVal: function(e) { //文字搜索更改监听
    this.setData({
      value: e.detail.value
    })
    //重置分页和数据
    this.resetPage();
    this.getCourseOrder();
  },
  cancelInput: function() { //文字删除监听
    this.setData({
      value: ''
    })
    //重置分页和数据
    this.resetPage();
    this.getCourseOrder();
  },
  bindPickerChange: function(e) { //状态更改监听
    //console.log('picker发送选择改变，携带值为', e)
    this.setData({
      index: e.detail.value
    });
    //重置分页和数据
    this.resetPage();
    this.getCourseOrder();
  },
  bindDateChange: function(e) { //日期更改监听
    this.setData({
      startTime: e.detail.value
    })
    //重置分页和数据
    this.resetPage();
    this.getCourseOrder();
  },
  cancelCourse: function(e) { //删除课程
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消这个订单吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.delCourse(e.currentTarget.dataset.id);
          //console.log(e.currentTarget.dataset.id);

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeCourse: function(e) { //调换课程监听
    //属性中的id
    console.log(e);
    wx.navigateTo({
      url: 'changecourse/changecourse?id=' + e.currentTarget.dataset.id + "&startTime=" + this.data.startTime + "&index=" + e.currentTarget.dataset.index,
    })
  },
  delCourse: function(id) {
    var that = this;
    util.mpNoToastRequest(app, {
      orderId: id
    }, app.url + '/admin/order/cancelOrder', function(res) {
      // console.log(res.data);
      if (res.data.success) {
        wx.showToast({
          title: '取消成功~',
          icon: 'none',
          duration: 1500,
          success: function() {
            that.resetPage();
            that.getCourseOrder();
          }
        })

      } else {
        wx.showToast({
          title: '出错啦~ ' + res.data.resultDesc,
          icon: 'none',
          duration: 2000,
          success: function() {

          }
        })
      }

    })
  },
  statusFormater: function(value) {
    var textName = '其他';
    switch (value) {
      case 1:
        textName = '待付款';
        break;
      case 2:
        textName = '用户取消';
        break;
      case 3:
        textName = '付款成功'; //已支付
        break;
      case 5:
        textName = '已完成';
        break;
      case 6:
        textName = '超时关闭';
        break;
      case 7:
        textName = '已结束'; //取消
        break;
      case 99:
        textName = '其他';
        break;
      default:
        break;
    }
    return textName;
  },
  onReachBottom: function(e) {
    if (this.data.hasNext) {
      this.setData({
        page: this.data.page + 1
      })
      this.getCourseOrder();
    }

  }
})