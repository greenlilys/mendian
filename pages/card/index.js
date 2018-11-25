var config = require('../../config');
var appInstance = getApp();

Page({
    data:({
        windowHeight:0,
        windowWidth:0,
        zheList:[],
        youList:[],
        currentTab: 0

    }),
    onLoad: function(options){
         var that = this;
         this.setData({
            currentTab: options.currentTab
         });
         wx.getSystemInfo({
              success: function (res) {
                   that.setData({
                       windowHeight: res.windowHeight,
                       windowWidth: res.windowWidth
                   });
              }
         });
    },
    bindChange: function (e) {
        var that = this;
        console.log(e);
        that.setData({
            currentTab: e.detail.current
        });
    },
  /** 
   * 点击tab切换 
   */
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return;
        } else {
            that.setData({
                currentTab: e.target.dataset.current

            })
        }
    },
	onPullDownRefresh:function(){
		console.log("12");
	},
    onShow:function(){
        var self = this;
        appInstance.sendRequest({
            url:config.myCouponUrl,
            success:function(res){
                config.debug && console.log(res);
                if(res.data.success){
                    var zheList = [],youList = [];
                    for(var i = 0;i < res.data.list.length;i++){
                        if(res.data.list[i].type == 0){
                            zheList.push(res.data.list[i]);
                        }else if(res.data.list[i].type == 1){
                            youList.push(res.data.list[i]);
                        }
                    }
                    self.setData({
                        zheList:zheList,
                        youList:youList
                    });
					//console.log(zheList);
                }

            }
        });
    },
})
