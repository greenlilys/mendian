var config = require('../../config');
var appInstance = getApp();

Page({
    data:{		
		currentTab: 0,
        orderList:[],
        windowHeight: 0,
        windowWidth:0
    },
    onLoad: function(options) {
		var self = this;
		wx.getSystemInfo({
			success: function (res) {
				console.log(res.windowHeight)
				self.setData({
					windowHeight: res.windowHeight,
					windowWidth: res.windowWidth
				});
			}
		});
    },
	
  
    onShow:function(){
		var that = this;
		appInstance.sendRequest({
			url:config.orderListUrl,
			success: function (res) {
				if (res.data.success == true) {
                    var orderedList = res.data.orders;
                    for(var i = 0;i< orderedList.length;i++){
                        var j;
                        orderedList[i].pay_price = appInstance.formatMoney(orderedList[i].pay_price);
                        orderedList[i].total_price = appInstance.formatMoney(orderedList[i].total_price);
                        orderedList[i].sheng_price = (j = orderedList[i].card_price + orderedList[i].intergal_price + orderedList[i].coupon_money) > 0 ? appInstance.formatMoney(j):0;
                    }
					that.setData({
						orderList: orderedList
					});
                   
				}else{
                    console.log(res);
                }
			}
		});
    },
	bindChange: function (e) {
		var that = this;
		that.setData({ currentTab: e.detail.current });

	},

	swichNav: function (e) {
		var that = this;
		if (that.data.currentTab === e.target.dataset.current) {
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.current
			})
		}
	}
})
