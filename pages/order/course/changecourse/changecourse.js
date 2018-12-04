// pages/order/course/changecourse/changecourse.js
const app = getApp()
const util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [],
    preItem: null, //之前的课程对象
    checkedItem: null, //选中的课程对象
    startTime: util.dateFormat(new Date(), "Y-M-D"),
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    console.log(options);
    this.setData({
      startTime: options.startTime,
      courseId: options.id,
      preItem: prePage.data.list[options.index]
    })
    this.getShiftCourseList();


  },
  getShiftCourseList: function() {
    var that = this;
    util.mpNoToastRequest(app, {
      startTime: that.data.startTime,
      orderId: that.data.courseId
    }, app.url + '/admin/course/shiftCourseList', function(res) {
      console.log(res.data);
      var newList = res.data.map(function(item, full) {
        //为图片formate
        return Object.assign(item, {
          cardType: that.statusFormater(item.shiftStatus)
        })
      })
      that.setData({
        radioItems: newList // that.data.list.concat(newList),
        // hasNext: (res.data.content.length <= 0 ? false : true)
      })
    })
  },
  statusFormater: function(shiftStatus) {
    var textName = '其他';
    switch (shiftStatus) { //"shiftStatus": 调课状态 1可调 2低调高（无法调课） 3已满 4关闭
      case 1:
        textName = '有效';
        break;
      case 2:
        textName = '低调高';
        break;
      case 3:
        textName = '人数已满';
        break;
      case 4:
        textName = '关闭';
        break;
      default:
        break;
    }
    return textName;

  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    var checkedItem;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].id == e.detail.value) {
        checkedItem = radioItems[i];
      }
      radioItems[i].checked = radioItems[i].id == e.detail.value;
    }
    
    this.setData({
      radioItems: radioItems,
      checkedItem: checkedItem
    });
  },
  bindDateChange: function(e) { //日期更改监听
    this.setData({
      startTime: e.detail.value
    })
    this.getShiftCourseList();
  },
  showAction: function() { //显示弹窗
    
    console.log(this.data.preItem);
    console.log(this.options.index);
    if (this.data.checkedItem) {
      this.setData({
        modalHidden: false,
      })
    }

  },
  modalCandel: function() { //弹窗取消
    // do something
    this.setData({
      modalHidden: true,
    })
  },
  modalConfirm: function() { //弹窗确定
    const pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    var that = this;
    console.log(that.data.checkedItem)
    util.mpNoToastRequest(app, {
      orderId: that.options.id,
      ctId: that.data.checkedItem.courseTime.id,
      isAmount: 0,
      payType: 0
    }, app.url + '/admin/order/changeCourse', function(res) {
      console.log(res.data);
      // do something
      that.setData({
        modalHidden: true,
      })
      if (res.data.success){
        
        wx.showToast({
          title: '调课成功',
          icon: 'none',
          duration: 1500,
          success: function (res) {
            prePage.resetPage();
            prePage.getCourseOrder();
            setTimeout(function () {
              wx.navigateBack()
            }, 1500)
          }
        })
        
      }else{
        wx.showToast({
          title: res.data.resultDesc,
          icon: 'none',
          duration: 1500,
          success: function (res) {
            
          }
        })
      }
    })
    return;
    
  }
})