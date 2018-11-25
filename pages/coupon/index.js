var config = require('../../config');
var appInstance = getApp();

Page({
	data: ({
		windowHeight: 0,
		windowWidth: 0,
		list: [
			// {
			// has:true,
			// value_price:100,
			// name:'优惠卷',
			// start_at:'2017-11-14',
			// end_at:'2017-11-15',
			// type : 1,
			// id:0
			
			// }
			
		]
	}),
	onLoad: function (options) {
		this.setData({
			currentTab: options.currentTab
		});
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					windowHeight: res.windowHeight,
					windowWidth: res.windowWidth
				});
			}
		});
	},

    onShow:function(){
        var self = this;
        appInstance.sendRequest({
			url: config.couponListUrl,
            success:function(res){
                config.debug && console.log(res);
                if(res.data.success){
					console.log(res.data.couponList);
                    self.setData({
                        list: res.data.couponList
                    })
                }
            }
        });
    },
    handlerCoupon: function(evt){
		console.log(evt);
        var self = this;
        appInstance.sendRequest({
			url: config.couponToMeUrl,
			method:'post',
			data:{couponId:evt.target.dataset.couponId},
            success:function(res){
				var list = self.data.list;
                if(res.data.success){//领取成功	
													
					for(var i = 0; i < list.length; i++){
						if (list[i].id == evt.target.dataset.couponId){							
							//list.splice(list.indexOf(list[i]),1);						
							list[i].has = true;													
						}
					};									
					self.setData({
						list:list
					});
					
					appInstance.showToast({
						title:'已领取'
					})
                }else{//领取失败
					appInstance.showToast({
						title: '领取失败'
					})

                }
            }
        });
    },
    /**
     * 数据初始化
     */
	dataInitial: function () {
		var that =this;
		appInstance.dataInitial();
		appInstance.sendRequest({
			url: MY_COUPONS_URL,
			success: function (res) {
				console.log(res);
				var list = that.data.list;
				for (var i = 0; i < res.median_coups.length; i++) {
					var item = {};
					item.start_at = res.median_coups[i].start_at;
					item.end_at = res.median_coups[i].end_at;
					item.name = res.median_coups[i].name;
					item.limit = "";
					if (res.median_coups[i].type == 0) {
						item.background = '#D5A85D';
						item.value_price = res.median_coups[i].value_price_zhe;
						item.type = 0;
					} else {
						item.background = '#E27365';
						item.value_price = res.median_coups[i].value_price;
						item.type = 1;
					}
					list[i] = item;
				};
				that.setData({
					list: list
				});
				//console.log(that.data.list); 查看返回的优惠卷数据
				
				//判断是否有优惠卷
				if (that.data.list.length == 0) {
					that.setData({
						isTrue: true
					})
				} else {
					that.setData({
						isTrue: false
					})
				};
			},
		})
	},

})
