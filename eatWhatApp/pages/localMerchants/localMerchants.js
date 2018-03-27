// pages/localMerchants/localMerchants.js
//获取应用实例
const app = getApp();
const $v = app.globalData;

Page({
  data: {
    index:'',
    groupLists:[],
    inputList: [{
      textContent: "",     //text 值
      label: "",              //label 的名字 最多4个字
      placeholder: "新建群名称",  //placeholder的值
      inputType: "input", //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
      selectList: [],  //选择框 内部循环列表  当type为select时必须要传当前值
    }]
  },
  todetail:function(e){
    var groupId = e.currentTarget.dataset.groupid
    wx.navigateTo({
      url: '../businessDetails/businessDetails?groupId='+groupId,
    })
  },
  /**
   * 获取本群商家
   */
  groupMearch(){
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_stores/s_bean',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        crowdId: $v.groupId
      },
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            groupLists: res.data.data.list
          })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.groupMearch();
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
  onLoad: function () {

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.setData({
      index: "2",
    })
    this.groupMearch();
  }
})
