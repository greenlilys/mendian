const TYPE = 'RECHARGE_MEMBER';
var config = require('../../config');
const MONEY_PATTERN = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
var appInstance = getApp();

Page({
    data:{
        priceArray:[
			{
				price: 100,
				id: 0,
				toggle: 'pad',
				toggles: 'i'
			},
			{
				price: 300,
				id: 1,
				toggle: 'pad',
				toggles: 'i'
			},
			{
				price: 500,
				id: 2,
				toggle: 'pad',
				toggles: 'i'
			}
		],//充值金额选项
		
        balance:'0.00',//余额
        inputPrice:'',//输入框金额
		loginBtn:'loginBtn',
		check:false,
		details:''
    },
    onShow:function(){
        var self = this;
        appInstance.sendRequest({
            url:config.cardInfoUrl,
            success:function(res){
                if(res.data.success){
					var priceArray = [];
					var details = res.data.youList;
					var str = JSON.stringify(details);
					console.log(str);
					var chongValue = res.data.chongValue;
					if (chongValue.length > 0){
						for (var i = 0; i < chongValue.length; i++) {
							var item = {
								toggle: 'pad',
								toggles: 'i'
							};
							item.price = chongValue[i];
							item.id = i;
							priceArray[i] = item;
						};
						self.setData({
							priceArray: priceArray
						});
					};					
                    self.setData({
                        balance:parseFloat(res.data.cardInfo.money||0).toFixed(2),
						details: str						
                    });
				console.log(self.data.details);
                }
            }
        });
    },
	details:function(){
       
	},
    copyPrice:function(event){
        var that = this;
        var id = event.target.id;
        var inputPrice = event.target.dataset.price;
        var priceArrays = that.data.priceArray;
        for(var i = 0; i<priceArrays.length; i++){
          priceArrays[i].toggle = 'pad';
          priceArrays[i].toggles = 'i';
        }
        priceArrays[id].toggle = 'pad add';
        priceArrays[id].toggles = 'i adds';
        that.setData({
          priceArray:priceArrays,
          inputPrice: inputPrice,
		  check: true
        });
	
	    
    },
    priceChange:function(event){
        var that = this;
        var priceArray_s = that.data.priceArray;
        var currentValue = event.detail.value;
        function getCurrentObj(num) {
          for (var i = 0; i < priceArray_s.length; i++) {
            if (priceArray_s[i].price == num) {
              priceArray_s[i].toggle = 'pad add';
              priceArray_s[i].toggles = 'i adds';
            }else{
              priceArray_s[i].toggle = 'pad';
              priceArray_s[i].toggles = 'i';
            }
          }
        };
       getCurrentObj(currentValue);
       
		if (MONEY_PATTERN.test(event.detail.value)) {
			that.setData({
				priceArray: priceArray_s,
				inputPrice: event.detail.value,
				check:true
			});
		}else{
			that.setData({
				check: false				
			});
		}
		console.log(that.data.inputPrice);
    },

    /**
     * 充值
     */
    onPay:function(){
        var totalpay = 0;
		console.log(this.data.inputPrice);
        if((totalpay = this.data.inputPrice) != 0){
            appInstance.sendRequest({
                url:config.cardRechargeUrl,
                method:'POST',
                data:{
                    type:TYPE,
                    total_pay:totalpay,
                    body:"充值"
                },
                success: function(res){
                    config.debug && console.log(res);
                    if(res.data.success){
                        var param = res.data.data.pay_info;
                        param.success = function(){
                            appInstance.showToast({
                                title:'成功充值'
                            });
                            appInstance.turnToPage("/pages/my/index");
                        };
                        appInstance.wxPay(param);
                    }else{
                        appInstance.showToast({
                            title: res.data.message
                        })
                    }
                }
            });
        }
    }
})
