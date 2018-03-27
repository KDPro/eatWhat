// pages/lunch/lunch.js
var app = getApp();
var $v = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:"",
    startDate:"",
    startTime:"",
    name:"",
    count:"",
    pay:"",
    payCount:"",
    voteDate:"",
    voteTime:"",
    departDate:"",
    departTime:"",
    select: false,
    selectVal:'',
    selectId:"",
    selectList:[]
  },
  selectShow: function () {
    this.setData({
      select: !this.data.select
    })
  },
  selectListValue: function (e) {
    var shopName = e.target.dataset.shopname;
    var storesId = e.target.dataset.storesid;
    this.setData({
      selectVal: shopName,
      selectId: storesId,
      select: !this.data.select
    })
  },
  bindDateChange: function (e) {
    this.setData({
      voteDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      voteTime: e.detail.value
    })
  },
  bindDChange: function (e) {
    this.setData({
      departDate: e.detail.value
    })
  },
  bindDTChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      departTime: e.detail.value
    })
  },
  //发起投票
  vote:function(){
    var that = this;
    var d = this.data;
    if (d.name == "" || d.selectId == "" || d.count == "" || d.pay == "" || d.payCount == "" || d.voteDate == "" || d.voteTime == "" || d.departDate == "" || d.coudepartTiment == "") {
      wx.showToast({
        title: '请输入完整内容',
        mask: true,
        duration: 1500,
        image: "../../img/tips.png"
      })
      return false;
    }
    if(d.count <=1) {
      wx.showToast({
        title: '人数需要大于1',
        mask: true,
        duration: 1500,
        image: "../../img/tips.png"
      })
      return false;
    }
    var m = (this.data.voteDate).replace(/-/g, "/");
    var n = (this.data.departDate).replace(/-/g, "/");
    wx.request({
      url: $v.appPath + 'pc_meal/save',
      method: "POST",
      header: {
        token: app.globalData.token
      },
      data: {
        crowdId:$v.groupId,
        name: this.data.name,
        storesId:this.data.selectId,
        num:this.data.count,
        amount:this.data.pay,
        perMoney:this.data.payCount,
        votetime: new Date(m +" "+this.data.voteTime).getTime(),
        goOff: new Date(n + " " + this.data.departTime).getTime(),
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 1000
          });
          setTimeout(() => {
            wx.navigateBack({
              changed: true
            });
          }, 1000)
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.vote();
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
  // 获取当前输入框的值
  inputVal1(e){
    var val = e.detail.value;
    this.setData({
      name:val
    })
  },
  inputVal2(e) {
    var val = e.detail.value;
    this.setData({
      count: val
    })
    if(this.data.pay!="") {
      var p = parseInt(this.data.pay)/parseInt(this.data.count);
      this.setData({
        payCount:parseInt(p)
      });
    }
  },
  inputVal3(e) {
    var val = e.detail.value;
    this.setData({
      pay: val
    })
    if (this.data.count != "") {
      var p = parseInt(this.data.pay) / parseInt(this.data.count);
      this.setData({
        payCount: parseInt(p)
      });
    }
  },
  inputVal4(e) {
    var val = e.detail.value;
    this.setData({
      payCount: val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startDate: app.times(new Date().getTime(), "date"),
      startTime: app.times(new Date().getTime(), "time")
    })
    console.log(this.data.startDate, this.data.startTime);
  },
  /**
   * 获取商户列表
   */
  mearchList(){
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
            selectList: res.data.data.list
          })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.mearchList();
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    $v.pageHide = true;
    this.setData({
      index: "0",
    })
    this.mearchList();
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