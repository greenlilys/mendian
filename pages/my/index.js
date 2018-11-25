var config  = require('../../config');
var appInstance = getApp();

Page({
    data: {
        openCard: false,//商家是否有会员卡功能		
        userInfo: {
            couponInfo: {
                youCoupon:6,
                cuCoupon:5,
                zheCoupon:4
            }                                                                                                                                                                                                                                                                                                           
        },
        hasCard:false,
        cardSetting: {},
        logo_img:"",       
		birthday: '请设置生日',
		endData:'',
		stop:false
		
    },
    onShow: function(){
        var self = this;
        appInstance.sendRequest({
            url: config.userCenterInfo,
            success: function(res){
				config.debug && console.log(res);
                if(res.data.success){
                    self.setData({
                        openCard: !!res.data.cardSetting,
                        cardSetting: res.data.cardSetting,
                        hasCard: !!res.data.userInfo.cardInfo,
                    });
					if (!!res.data.userInfo.cardInfo){
						res.data.userInfo.cardInfo.money = appInstance.formatMoney(res.data.userInfo.cardInfo.money);
					}

                    self.setData({
                        userInfo:res.data.userInfo,
						logo_img: res.data.appInfo.appLogo
                    });
					
					if(res.data.userInfo.cardInfo.birthday){
						self.setData({
							birthday: res.data.userInfo.cardInfo.birthday,
							stop:true
						})
					}else{
						var myTime = new Date();//当前系统的时间对象
						var year = myTime.getFullYear();
						var month = self.toTwo(myTime.getMonth() + 1);
						var data = self.toTwo(myTime.getDate());
						var endData = year + '-' + month + '-' + data;
						self.setData({
							endData: endData,
							stop:false
						});

					};

                }
            }
        })
    },
	bindDateChange: function (e) {
		
		this.setData({
			birthday: e.detail.value,
			stop:true
		});
		if (e.detail.value){
			appInstance.sendRequest({
				url: config.setMemberBirthdayUrl,
				method: 'POST',
				data: {
					birthday:e.detail.value
				},
				success: function (res) {
					config.debug && console.log(res);
					if (res.data.success) {
						console.log("good");
					} else {
						console.log("bad");
					}
				}
			})
		}
	
	},
    nav:function(){
        wx.navigateTo({
            url: '/pages/memberCard/index'
        })
    },
	toTwo:function(n){
		return n < 10 ? '0' + n : '' + n;
	},
    onLoad:function () {
		
    }
});
