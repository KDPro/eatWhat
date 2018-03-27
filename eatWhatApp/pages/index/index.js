//index.js
//获取应用实例
const app = getApp();
const $v = app.globalData;
Page({
  data: {
    modalShow:false,
    inputList: [{
      textContent: "",     //text 值
      label: "",              //label 的名字 最多4个字
      placeholder: "新建群名称",  //placeholder的值
      inputType: "input", //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
      selectList: [],  //选择框 内部循环列表  当type为select时必须要传当前值
    }],
    groupLists:[]
  },
  //弹框的出现
  layerShow(){
    this.setData({
      modalShow:true
    })
  },
  //点击跳转搜索框
  search(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  //获取群列表
  groupList(){
    var that = this;
    wx.request({
      url: $v.appPath +'/pc_crowd/s_my_crowd',
      method:"GET",
      header: {
        token: app.globalData.token
      },
      data:{
        uid: $v.uid
      },
      success:(res)=>{
        if(res.data.code == 0) {
          var d = res.data.data;
          d.forEach((e,index)=>{
            d[index].cDate = app.times(e.cDate,"date");
          });
            this.setData({
              groupLists: d
            })
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.groupList();
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
  // 创建群
  createGroup(e){
    var that = this;
    var groupName = e.detail[0].value;
    if (groupName ==undefined) {
           wx.showToast({
             title: '请输入群名称',
             mask:true,
             duration:1500,
             image:"../../img/tips.png"
           })
          return;
    }
    wx.request({
      url: $v.appPath + '/pc_crowd/save',
      method: "POST",
      header:{
        token: app.globalData.token
      },
      data: {
        crowdName: groupName
      },
      success: (res) => {
        if (res.data.code == 0) {
          var d = this.data.groupLists;
          var m = res.data.data;
          m.url = $v.userInfo.url;
          m.nickname = $v.userInfo.nickname;
          m.cDate = app.times(res.data.data.cDate, "date")
          d.push(res.data.data);
          this.setData({
            groupLists:d
          })
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 1500
          });
          setTimeout(()=>{
            this.setData({
              modalShow: !this.data.modalShow
            })
          },1000)
        }else if(res.data.code=="50050"){
              app.login('','',function(){
                that.createGroup(e);
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
  //点击群，跳转群内操作
  toGroup(e){
    var id = e.currentTarget.dataset.groupid;
    var crowdmoney = e.currentTarget.dataset.crowdmoney;
    var crowdname = e.currentTarget.dataset.crowdname;
    $v.groupId = id;
    $v.crowdMoney = crowdmoney;
    $v.crowdName = crowdname;
    wx.navigateTo({
      url: '../group/group',
    });
  },
  onLoad:function(){
    
    
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    $v.headerIndex = 10;
    var timer = setInterval(() => {
      if ($v.uid) {
        clearInterval(timer);
        this.groupList();
      }
    }, 10);
  }
})
