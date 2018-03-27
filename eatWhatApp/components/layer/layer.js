// components/layer.js
Component({
  properties: {
    modalShow:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value: "提示"
    },  
    inputList:{
      type:Array,
      value: [{
        textContent: "",     //text 值
        label: "",              //label 的名字 最多4个字
        placeholder: "",  //placeholder的值
        inputType: "text", //"labelInput"带有label的input  "select"选择框  "text"提示信息  "input"不带有label的input 默认text
        selectList: [],  //选择框 内部循环列表  当type为select时必须要传当前值
      }]
    }
  },
  data: {
    // 这里是一些组件内部数据
    select:false
  },
  methods: {
    selectShow:function(){
      this.setData({
        select:!this.data.select
      })
    },
    selectListValue:function(e){
      var index = e.target.dataset.index;
      var parentindex = e.target.dataset.parentindex;
      var setVal = "inputList["+parentindex+"].value";
      var setValId = "inputList[" + parentindex + "].valueId";
      this.setData({
        [setVal]: this.data.inputList[parentindex].selectList[index].name,
        [setValId]: this.data.inputList[parentindex].selectList[index].id,
        select: !this.data.select
      })
    },
    inputVal: function (e) {
      var value = e.detail.value;
      var index = e.target.dataset.index;
      var setVal = "inputList[" + index + "].value";
      this.setData({
        [setVal]: value
      })
      this.setData({
        value: value
      });
    },
    confirm(){
      var valArr = this.data.inputList;
      var conArr = [];
      for(var i=0;i<valArr.length;i++) {
        conArr.push({
          "value":valArr[i].value,
          "valueId": valArr[i].valueId
        })
      }
      this.triggerEvent("myeventBox",conArr);
    },
    cancel(){
      this.setData({
        modalShow: false
      })
    }
    // 这里放置自定义方法  

  }
}) 