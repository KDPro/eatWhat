// pages/businessDetails/businessDetails.js
const app = getApp();
const $v = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    detail:{}
  },
  /**
   * 获取商家详情
   */
  bussinessDetail(){
    wx.request({
      url: $v.appPath + 'pc_stores/s_bean',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        storesId: this.data.id
      },
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            detail:res.data.data.list[0]
          })
        } else {
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
    console.log(options.groupId);
    this.setData({
      id: options.groupId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.bussinessDetail()
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