// pages/group/group.js
const app = getApp();
const $v = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socket:false,
    btnDis:true,
    voteY:"",
    index:"",
    disable:true,
    editAllP:'',
    editP:[],
    ifSuccess:false,
    mellList:[],
    pcmealid:'',
    modalShow: false,
    inputList: [{
      textContent: "群定投票吗？",     //text 值
      inputType: "text" //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
    }],
    yesVote:{}
  },

  //点击投票按钮
  vote(e){
    var state = e.target.dataset.state;
    var num = e.target.dataset.num;
    var currents = e.target.dataset.currents;
    if (this.data.btnDis == false) {
      wx.showToast({
        title: '您已经投过票了',
        duration:1500,
        image:"../../img/tips.png"
      })
      return false;
    }
    if (state > 0 || (num==currents)) {
      wx.showToast({
        title: '此单不能投票',
        duration: 1500,
        image: "../../img/tips.png"
      })
      return false;
    }
    console.log(e);
    var pcmealids = e.target.dataset.pcmealid;
    this.setData({
      modalShow: true,
      pcmealid: pcmealids
    })
  },
  //组件返回操作
  myeventBox(){
    var that = this;
    var pcmealidm = that.data.pcmealid
    console.log(pcmealidm);
    wx.request({
      url: $v.appPath + 'toJoinTheParty',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        pcMealId: pcmealidm,
        pcMemberId:$v.uid
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '投票成功',
            mask: true,
            duration: 1500
          })
          that.setData({
            voteY:pcmealidm,
            modalShow: !that.data.modalShow
          })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.myeventBox();
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
  // 点击确定按钮
  success(e){
    var that = this;
    var id = e.target.dataset.id;
    var d = this.data.editP;
    var sum = 0;
    console.log(d);
    d.forEach((e,index)=>{
      sum+=(0-parseInt(e.pay))
    });
    if(sum != this.data.editAllP) {
      wx.showToast({
        title: '计算总价不相等',
        duration:1500,
        image:"../../img/tips.png"
      })
      return false;
    }
    wx.request({
      url: $v.appPath + 'pc_meal/edit_pay',
      method: "POST",
      header: {
        token: app.globalData.token
      },
      data: {
        pcMeal: {
          id: id,
          amount: this.data.editAllP
        },
        lPayRecords: this.data.editP
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '拼餐成功',
            duration: 1500
          })
          setTimeout(()=>{
            this.setData({
              ifSuccess:false
            })
          },2000);
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.success(e);
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
   
      // / pc_meal / edit_pay
  },
  //点击修改按钮
  canel(){
    this.setData({
      disable:false
    })
  },
  //修改合计价格 
  editAllPrice(e){
    var val = e.detail.value;
    var per = parseInt(val /(this.data.yesVote.lMembers.length));
    console.log(this.data.yesVote.lMembers.length);
    console.log(per);
    var d = "yesVote.perMoney";
    var m = this.data.editP;
    console.log();
    m.forEach((e,index)=>{
      m[index].pay = -parseInt(per);
    });
    console.log(m);
    this.setData({
      editAllP:val,
      [d]: per,
      editP:m
    })
  },
  editPrice(e){
    var val = e.detail.value;
    var index = e.target.dataset.index;
    var id = e.target.dataset.id;
    var json = {
      pay:-val,
      cUser:id
    }
    var v = "editP["+index+"]";
    this.setData({
      [v]: json
    })
    console.log(this.data.editP);
  },
  /**
   * 获取当前拼餐成功的案例
   */
  getMellYes(){
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_meal/init_meal',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        uid: $v.uid
      },
      success: (res) => {
        if (res.data.code == 0) {
          if(res.data.data != null) {
              var d = res.data.data;
              if(d.currents <d.num ) {
                this.setData({
                  btnDis:false
                })
              } else if (d.currents == d.num) {
                this.setData({
                  btnDis: true
                })
              }
                d.votetime = app.times(d.votetime, "fulldate");
                d.goOff = app.times(d.goOff, "fulldate");
              var m = d.lMembers;
              var editPr = [];
              m.forEach((e,index)=>{
              var json = {
                pay:-parseInt(d.perMoney),
                cUser:e.id
              };
              editPr.push(json);
            });
              this.setData({
              ifSuccess:true,
              editAllP:d.amount,
              editP: editPr,
              yesVote: d
            })
          }
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.getMellYes();
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
   * 查询餐表
   */
  getMell(){
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_meal/s_bean',
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
          d.forEach((e,index)=>{
            d[index].votetime = app.times(e.votetime,"fulldate");
            d[index].goOff = app.times(e.goOff,"fulldate");
          })
          this.setData({
            mellList:d
          })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.getMell();
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
   * socket
   */
  socket(){
    var that = this;
    // if(this.data.socket) {
      // console.log(111);
      // $v.socektTask.close();
      // $v.socektTask.onClose(function () {
      //   console.log("关闭成功");
      //   $v.socektTask = wx.connectSocket({
      //     url: $v.socketPath + 'webSocket/' + $v.groupId + "/" + $v.uid,
      //     data: {},
      //     header: {
      //       token: $v.token
      //     },
      //     method: "GET",
      //     success: function () {
      //       that.setData({
      //         socket: true
      //       })
      //     }
      //   });
      //   wx.onSocketOpen(function (res) {
      //     console.log('WebSocket连接已打开！')
      //   });
      //   wx.onSocketError(function (res) {
      //     console.log('WebSocket连接打开失败，请检查！')
      //   });
      //   wx.onSocketMessage(function (res) {
      //     console.log(res);
      //     that.onShow();
      //   })
      // })
      // wx.onSocketOpen(function () {
      //   wx.closeSocket()
      // })

      // wx.onSocketClose(function (res) {
      //   console.log('WebSocket 已关闭！')
      // })
    // }
    $v.socektTask = wx.connectSocket({
      url: $v.socketPath+'webSocket/'+$v.groupId+"/"+$v.uid,
      data: {},
      header: {
        token:$v.token
      },
      method: "GET",
      success:function(){
        that.setData({
          socket:true
        })
      }
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    });
    wx.onSocketMessage(function (res) {
      console.log(res);
      that.onShow();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // this.socket();
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
    var that = this;
    this.setData({
      index:"10",
    })
    this.getMell();
    this.getMellYes();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // $v.socektTask.close();
    // $v.socektTask.onClose(function(){
    //   console.log("关闭成功");
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // $v.socektTask.close();
    // $v.socektTask.onClose(function () {
    //   console.log("关闭成功111");
    // })
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