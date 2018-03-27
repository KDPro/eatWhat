// pages/search/search.js
//获取应用实例
const app = getApp();
const $v = app.globalData;
Page({
  data: {
    id:"",
    modalShow: false,
    searchText:'',
    inputList: [{
      textContent: "群名称",     //text 值
      inputType: "text" //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
    }],
    noneData:false,
    groupLists:[]
  },
  //弹框的出现
  addGroup(e) {
    var id = e.target.dataset.id;
    var name = e.target.dataset.name;
    var m = "inputList[0].textContent";
    this.setData({
      id:id,
      [m]: name,
      modalShow: true
    });
  },
  //加群
  myeventBox(e) {
    var that = this;
    var id = this.data.id;
    var uid = $v.uid;
    wx.request({
      url: $v.appPath + 'pc_crowd/save_cm',
      method: "POST",
      header: {
        token: app.globalData.token
      },
      data: {
        crowdId: id,
        memberId: uid
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 1500
          });
          setTimeout(() => {
            this.setData({
              modalShow: !this.data.modalShow
            });
          }, 1000)
        } else if (res.data.code == "50050") {
          app.login('', '', function () {
            that.myeventBox(e);
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
  //输入获取值
  searchT(e) {
    var searchText = e.detail.value;
    this.setData({
      searchText: searchText
    })
  },
  // 搜索
  search(){
    var that = this;
    wx.request({
      url: $v.appPath + 'pc_crowd/s_icu',
      method: "GET",
      header: {
        token: app.globalData.token
      },
      data: {
        icu: this.data.searchText
      },
      success: (res) => {
        if (res.data.code == 0) {
          var d = res.data.data;
          if(d.length==0) {
            this.setData({
              noneData:true
            })
          } else if (res.data.code == "50050") {
            app.login('', '', function () {
              that.search();
            });
          }else {
            this.setData({
              noneData: false
            })
          }
          this.setData({
            groupLists: d
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
  onLoad: function () {

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

  }
})
