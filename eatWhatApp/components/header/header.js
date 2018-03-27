const app = getApp();
const $v = app.globalData;
Component({
  properties: {
    indexY:{
      type:String,
      value:""
    }
  },
  data:{
    modalShow: false,
    inputList: [{
      textContent: "群名称",     //text 值
      inputType: "text" //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
    }],
    isShow: true,
    otherList: ['成员列表', '本群商家', '帐薄详情', '退出该群']
  },
  ready: function (e) {

  },
  methods:{
    
    //点击期望早餐
    breakfast(e){
      console.log('期望早餐');
      if (this.data.indexY == "10") {
        wx.navigateTo({
          url: '../lunch/lunch',
        })
      } else {
        wx.redirectTo({
          url: '../lunch/lunch',
        })
      }
    },
    //点击新建商家
    business(){
      console.log('新建商家')
      if(this.data.indexY == "10") {
        wx.navigateTo({
          url: '../newVeg/newVeg',
        })
      }else {
        wx.redirectTo({
          url: '../newVeg/newVeg',
        })
      }
      
    },
    //点击其他
    other(){
      console.log('其他');
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //点击其他下面的选项
    otherS(e){
      let index = e.currentTarget.dataset.index;
      switch(index){
        case 0:
        console.log('成员列表');
        if (this.data.indexY == "10") {
          wx.navigateTo({
            url: '../member/member',
          })
        } else {
          wx.redirectTo({
            url: '../member/member',
          })
        }
        break;
        case 1:
        console.log('本群商家');
        if (this.data.indexY == "10") {
          wx.navigateTo({
            url: '../localMerchants/localMerchants',
          })
        } else {
          wx.redirectTo({
            url: '../localMerchants/localMerchants',
          })
        }
    
        break;
        case 2:
        console.log('帐薄详情');
        if (this.data.indexY == "10") {
          wx.navigateTo({
            url: '../localBook/localBook',
          })
        } else {
          wx.redirectTo({
            url: '../localBook/localBook',
          })
        }
        break;
        case 3:
        console.log('退出该群');
        this.quitGroup((data)=>{
          if(data == true) {
            var s = "inputList[0].textContent"
            this.setData({
              [s]: $v.crowdName,
              modalShow: !this.data.modalShow
            })
          }
        });
        break;
      }
    },
    //判断是否退出该群
    quitGroup(callBack){
      var that = this;
      wx.request({
        url: $v.appPath + 'pc_crowd/s_uid_money',
        method: "GET",
        header: {
          token: app.globalData.token
        },
        data: {
          crowdId: $v.groupId,
          memberId: $v.uid
        },
        success: (res) => {
          if (res.data.code == "50050") {
            app.login('', '', function () {
              that.quitGroup(callback);
            });
          }
          if (res.data > 0) {
            wx.showModal({
              title: '提示',
              content: '您在该群还有余额，确定要退群？',
              success:(res)=>{
                if (res.confirm) {
                  callBack(true);
                } else if (res.cancel) {
                  callBack(false);
                }
              }
            })
            
          } else if(res.data == ""){
            callBack(true);
          }else if(res.data <0) {
            wx.showModal({
              title: '提示',
              content: '您在该群有欠款，不可以退群',
              showCancel:false
            })
            callBack(false);
          }
        }
      })
    },
    myeventBox(e){
      wx.request({
        url: $v.appPath + 'pc_crowd/del_cm',
        method: "POST",
        header: {
          token: app.globalData.token
        },
        data: {
          crowdId: $v.groupId,
          memberId :$v.uid
        },
        success: (res) => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '退出成功',
              mask: true,
              duration: 1500
            });
            setTimeout(() => {
              this.setData({
                modalShow: !this.data.modalShow
              })
            }, 1000)
            wx.redirectTo ({
              url: '../index/index',
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
    }
  }
})