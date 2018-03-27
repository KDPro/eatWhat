// pages/localBook/localBook.js
const app = getApp();
const $v = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:"",
    crowdName:"",
    crowdMoney:"",
    modalShow: false,
    selectShow:false,
    inputList:[],
    title:"",
    payMentList:[{
      url:"../../static/indexB.png",
      name:"王小二",
      data:"2017年11月11号",
      charge:"100",
      pay:"30",
      account:"70"
    }, {
      url: "../../static/indexB.png",
      name: "王小二",
      data: "2017年11月11号",
      charge: "100",
      pay: "30",
      account: "70"
      }, {
        url: "../../static/indexB.png",
        name: "王小二",
        data: "2017年11月11号",
        charge: "100",
        pay: "30",
        account: "70"
    }, {
      url: "../../static/indexB.png",
      name: "王小二",
      data: "2017年11月11号",
      charge: "100",
      pay: "30",
      account: "70"
      }, {
        url: "../../static/indexB.png",
        name: "王小二",
        data: "2017年11月11号",
        charge: "100",
        pay: "30",
        account: "70"
    }, {
      url: "../../static/indexB.png",
      name: "王小二",
      data: "2017年11月11号",
      charge: "100",
      pay: "30",
      account: "70"
      }, {
        url: "../../static/indexB.png",
        name: "王小二",
        data: "2017年11月11号",
        charge: "100",
        pay: "30",
        account: "70"
    }, {
      url: "../../static/indexB.png",
      name: "王小二",
      data: "2017年11月11号",
      charge: "100",
      pay: "30",
      account: "70"
      }, {
        url: "../../static/indexB.png",
        name: "王小二",
        data: "2017年11月11号",
        charge: "100",
        pay: "30",
        account: "70"
      }]
  },
  // 账户操作
  selectShowF:function(){
    this.setData({
      selectShow: !this.data.selectShow
    })
  },
  //充值
  toCharge(){
    this.setData({
      selectShow: !this.data.selectShow
    });
    var json;
    this.getGroupUser((data)=>{
      data.forEach((e,index)=>{
        data[index].name = e.nickname;
      });
      json = [{
        label: "人员",              //label 的名字 最多4个字
        placeholder: "",  //placeholder的值
        inputType: "select", //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
        selectList: data,  //选择框 内部循环列表  当type为select时必须要传当前值
      }, {
        label: "金额",              //label 的名字 最多4个字
        placeholder: "单位：元",  //placeholder的值
        inputType: "labelInput", //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
      }];
      this.setData({
        modalShow: true,
        title: '充值',
        inputList: json
      })
    })
  },
  //提现
  recharge(){
    this.setData({
      selectShow: !this.data.selectShow
    });
    var json = [{
      label: "金额",              //label 的名字 最多4个字
      placeholder: "单位：元",  //placeholder的值
      inputType: "labelInput", //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
    }];
    this.setData({
      title: "提现",
      modalShow: true,
      inputList: json
    })
  },
  //组件返回值
  myeventBox(e) {
    this.toChargeSubmit(e.detail)
  },
  /**
   * 充值和提现提交
  */ 
  toChargeSubmit (data){
    var that = this;
    var dataD= data;
    var json;
    if(data.length == 2) {
      var reg = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
      if(data[0].value == undefined) {
        wx.showToast({
          title: '请选择人员',
          mask: true,
          duration: 1500,
          image:"../../img/tips.png"
        });
        return false;
      }
      if (!reg.test(data[1].value)) {
        wx.showToast({
          title: '请输入正确价格',
          mask: true,
          duration: 1500,
          image: "../../img/tips.png"
        });
        return false;
      }
      json = {
        crowdId: $v.groupId,
        pay: data[1].value,
        memberId: data[0].valueId
      }
    }else {
      var reg = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
      if (!reg.test(data[0].value)) {
        wx.showToast({
          title: '请输入正确的价格，保留两位小数',
          mask: true,
          duration: 1500
        });
        return false;
      }
      json = {
        crowdId: $v.groupId,
        pay: "-"+data[0].value,
        memberId: $v.uid
      }
    }
    
    wx.request({
      url: $v.appPath + 'pc_pay_record/save',
      method: "POST",
      header: {
        token: app.globalData.token
      },
      data:json,
      success: (res) => {
        if (res.data.code == 0) {
          var data = this.data.payMentList;
          var dt = res.data.data;
          dt.cDate = app.times(dt.cDate, "date");
          data.splice(0,0,dt);
          this.setData({
            payMentList:data
          });
          wx.showToast({
            title: '成功',
            mask: true,
            duration: 1500
          });
          setTimeout(() => {
            this.setData({
              modalShow: !this.data.modalShow
            })
          }, 1000)
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.toChargeSubmit(dataD);
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
   * 查询群账户列表
   */
  accountList(){
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_pay_record/s_bean',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        crowdId: $v.groupId
      },
      success: (res) => {
        if (res.data.code == 0) {
          var d = res.data.data.list;
          d.forEach((e, index) => {
            d[index].cDate = app.times(e.cDate, "date");
          });
          this.setData({
            payMentList: d
          })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.accountList();
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
   * 查询群成员
   */
  getGroupUser(callBack){
    var fun = callBack;
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_member/s_all_user',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        crowdId: $v.groupId
      },
      success: (res) => {
        if (res.data.code == 0) {
          callBack(res.data.data)
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.getGroupUser(fun);
          });
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
      crowdName: $v.crowdName,
      crowdMoney: $v.crowdMoney,
      index: "2"
    })
    this.accountList()
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