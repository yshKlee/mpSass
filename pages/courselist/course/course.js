// pages/courselist/course/course.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0, //分页
    list: [],
    hasNext: true,
    startTime: util.dateFormat(new Date(), "Y-M-D"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCourse();
  },
  getCourse: function() {
    var that = this;
    util.mpNoToastRequest(app, {
      size: 10,
      page: that.data.page,
      startTime: that.data.startTime,
    }, app.url + '/admin/course/courseList', function(res) {
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
    //console.log('picker发送选择改变，携带值为', e)
    this.setData({
      startTime: e.detail.value
    });
    //重置分页和数据
    this.resetPage();
    this.getCourse();
  },
  onReachBottom: function(e) {
    if (this.data.hasNext) {
      this.setData({
        page: this.data.page + 1
      })
      this.getCourse();
    }

  },
  statusFormater: function (value) {
    var textName = '其他';
    switch (value) {
      case 1:
        textName = '开课中';//有效
        break;
      case 2:
        textName = '已结束';//关闭
        break;
      case 3:
        textName = '开课中'; //人数已满
        break;
      case 4:
        textName = '已结束'; //用户取消
        break;
      case 5:
        textName = '已结束'; //已完成
        break;
      default:
        break;
    }
    return textName;
  }
})