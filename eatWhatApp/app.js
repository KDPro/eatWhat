//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 登录

    wx.getUserInfo({
      success: res => {
        // console.log(res);
        this.login(res.encryptedData, res.iv);
        this.globalData.wxLogin = {
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      },
      fail: res => {

        this.login();
      }
    });
    // 发送 res.code 到后台换取 openId, sessionKey, unionId

  },
  //调用后台 获取token；
  login: function (encryptedData, iv,callback) {
    var that = this;
    wx.login({
      success: r => {
        var code = r.code;
        wx.request({
          url: this.globalData.appPath + 'login',
          method: "GET",
          data: {
            encryptedData: encryptedData,
            iv: iv,
            code: code,
            // password:'123'
          },
          success: function (res) {
            // console.log(res);
            if (res.data.code == 0) {
              if (res.data.token) {
                var token = "globalData.token";
                that.globalData.token = res.data.token;
                that.check();
                if (callback){
                  callback();
                }
              }
            }
            else {
              wx.showModal({
                content: "吃什么小程序需要获取您的用户信息",
                showCancel: false,
                confirmText: "重新拉取",
                success: function (res) {
                  wx.openSetting({
                    success: (res) => {
                      wx.login({
                        success: r => {
                          var code = r.code;

                          wx.getUserInfo({
                            success: res => {
                              that.login(res.encryptedData, res.iv);
                            },
                            fail: res => {

                              that.login();
                            }
                          });
                          // 发送 res.code 到后台换取 openId, sessionKey, unionId
                        }
                      })

                    }, fail: (res) => {
                      this.login();
                    }

                  })
                }
              })
            }
          },
          fail: function (res) {

          }
        })
      }
    })

  },
  check: function () {
    var that = this;
    wx.request({
      url: this.globalData.appPath + 's_info',
      header: {
        token: that.globalData.token
      },
      data: {
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.uid = res.data.userInfo.id;
          that.globalData.userInfo = res.data.userInfo;
        }
      }
    })
  },
  // 通过时间戳获取时间
  times: function (val, date) {
    var time = new Date(val);
    var year = time.getFullYear();
    var month = time.getMonth() >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1);
    var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate();
    var hour = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours();
    var min = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes();
    var sec = time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds();
    if (date == "date") {
      return (year + "-" + month + "-" + day);
    } else if (date == "time") {
      return (hour + ":" + min);
    } else if (date == "fulldate") {
      return (year + "-" + month + "-" + day + " " + hour + ":" + min);
    }

  },
  onLoad: function () {

  },
  globalData: {
    userInfo: null,
    uid: null,
    groupId: "112",  //测试群号，后期设置为null
    crowdName: "",
    crowdMoney: "",
    // appPath: "http://192.168.20.136:8082/",
    appPath: "http://192.168.20.136:8082/",
    socketPath: "ws://192.168.20.136:8082/",
    // appPath: "http://192.168.20.8:8080/",
    // appPath: "http://192.168.20.8:8082/",
    // socketPath: "ws://192.168.20.8:8082/",
    token: '',
    pageHide: true
  }
})