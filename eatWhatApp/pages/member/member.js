// pages/member/member.js
const app = getApp();
const $v = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:"",
    memberList:[
      {
        src: '../../img/1.png',
        name: '深情不及'
      },{
        src: '../../img/2.png',
        name: '淡然'
      }, {
        src: '../../img/3.png',
        name: 'var'
      }, {
        src: '../../img/4.png',
        name: '肥肉菲菲'
      }, {
        src: '../../img/1.png',
        name: '圣诞节'
      }, {
        src: '../../img/2.png',
        name: '星星点灯'
      }, {
        src: '../../img/3.png',
        name: 'PADA'
      }
    ]
  },
  //获取群成员
  getGroupUser(){
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_member/s_all_user',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        crowdId:$v.groupId
      },
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            memberList:res.data.data
          })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.getGroupUser();
          });
        }else {
          wx.showModal({
            title: '提示:',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      index: "2",
    })
    this.getGroupUser();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})