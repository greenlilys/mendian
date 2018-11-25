var appInstance = getApp();
var config = require('../../config');
const MONEY_PATTERN = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

/**
 * 支付的方法分可用：
 *      cardInfo.use   是否用卡等级
 *      couponInfo.use 是否用券
 *      intragelInfo.use 是否用积分
 *      moneyInfo.use 是否用余额
 */
Page({
    data:{
        scanCodeContent:null,
        cash: "消费总金额（元）",
        display: false,
        userCard:{
        },
        cardInfo:{//会员
            use: false,
            zhe:0,
            money:0,
        },
        couponInfo:{//优惠券
            use: false,
            useing:false,
            money:0,
            couponId:0,
        },//优惠券
        intragelInfo:{//积分抵扣
            use: false,
            using:false,
            intragel:0,
            intragel_pre:0.01,
            money:0.00
        },
        moneyInfo:{//余额
            use:false,
            using:false,
            money:0.00
        },
        couponList:[],//用户有的券
        newCouponList:[],//可用的券
        check:false,
        inputValue:0,//当前输入值
        totalPay:0,//要支付的
        displayTotalPay:"0.00",
        path:false,
    },
    onLoad:function(options) {
        console.log(options);
        if(options.scene){
            this.setData({
                path: "pages/payOrder/index?scene=" + options.scene
            });
        }
        console.log(this.data);

    },
    onShow:function(){
        var self = this;
        appInstance.sendRequest({
            url: config.getPayInfoUrl,
            success: function(res){
                if(res.data.success){
                    appInstance.setPageTitle(res.data.pageTitle);

                    //是否可用
                    self.setData({
                        'intragelInfo':res.data.intragelInfo,
                        'cardInfo': res.data.cardInfo,
                        'moneyInfo.use': res.data.moneyInfo.use,
                        'couponInfo.use': res.data.couponInfo.use,
                        'intragelInfo.intragel': res.data.intragelInfo.intragel,
                        'intragelInfo.money': appInstance.formatMoney(res.data.intragelInfo.money),
                        'moneyInfo.money': res.data.moneyInfo.money,
                        'couponList':res.data.userCouponList
                    });

                    console.log(self.data);
                }else{
                    appInstance.showToast({
                        title:res.data.message,
                        image:'/images/errors.png'
                    });
                    setTimeout(function(){
                        appInstance.turnToPage('/pages/home/index');
                    },1000);
                }
            }
        });
    },
    /**
     * 提交支付
     */
    goPay: function(){
        var self = this;
        function paySuccess(){
            appInstance.showToast({
                title:'支付成功',
            });
            setTimeout(function(){
                appInstance.turnToPage('/pages/order/index');
            },1000);
        }

        function payFail(){
            appInstance.showToast({
                title:'支付失败',
                image:'/images/errors.png'
            });
            setTimeout(function(){
                appInstance.turnToPage('/pages/order/index');
            },1000);
        }

        if(self.data.check){
            appInstance.sendRequest({
                url: config.goPayUrl,
                data:{
                    inputValue:self.data.inputValue,//输入的总值
                    totalPay:self.data.totalPay,//要支付的金额
                    cardInfo: self.data.cardInfo,//会员卡使用信息
                    couponInfo:self.data.couponInfo,//券使用信息
                    moneyInfo: self.data.moneyInfo,//余额使用信息
                    intragelInfo: self.data.intragelInfo,//积分信息
                    path:self.data.path,//扫码内容
                },
                method:"post",
                success: function(res){
                    if(res.data.success){
                        if(res.data.payInfoParmas){//要求用户发起微信支付
                            var params = res.data.payInfoParmas;

                            params.success = function(){
                                paySuccess();
                            };
                            params.fail = function(){
                                payFail();
                            };
                            appInstance.wxPay(params);
                        }else{//服务器处理过，没有产生要支付的金额
                            paySuccess();
                        }
                    }else{
                        appInstance.showToast({
                            title: res.data.message
                        })
                    }
                }
            });
        }
    },
    handleTaggle:function(){
        var self = this,display = !this.data.display;

        if(display){
            var couponList = this.data.couponList,
                inputValue = self.data.inputValue,
                tmp = [];
            for(var i=0;i < couponList.length;i++){
                if( couponList[i].man <= 0|| (couponList[i].man > 0 && couponList[i].man <= inputValue)){
                    tmp.push(couponList[i]);
                }
            }
            self.setData({
                'newCouponList': tmp
            })
        }

        self.setData({
            display: display
        })
    },
    handItem: function(evt){
        var couponId = evt.currentTarget.dataset.couponid,
            couponList = this.data.couponList,
            money = 0.00,self = this;
        if(couponId != self.data.couponInfo.couponId){
            for(var i=0;i<couponList.length;i++){
                if(couponList[i].id == couponId){
                    if(couponList[i].type == 1){//优惠券
                        money=couponList[i].value_price;
                    }else{
                        money=  (1- couponList[i].value_price_zhe * 0.1) * self.data.inputValue;
                    }
                    money.toFixed(2);
                }
            }
            this.setData({
                'couponInfo.couponId': evt.currentTarget.dataset.couponid,
                'couponInfo.money': money,
            });
        }else{
            this.setData({
                'couponInfo.couponId':0,
                'couponInfo.money': 0,
            });
        }


        this.computePay();
    },
    switchChange:function(evt){
        var self = this;
        this.setData({
            "intragelInfo.using": !self.data.intragelInfo.using
        });
        this.computePay();

    },
    switch2Change:function(evt){
        var self = this;
        this.setData({
            "moneyInfo.using": !self.data.moneyInfo.using
        });
        this.computePay();
    },
    /**
     * 输入处理
     * @param evt
     */
    onInput:function(evt){
        var self = this;
        if(MONEY_PATTERN.test(evt.detail.value)){

            self.setData({inputValue:evt.detail.value,check: true,display:false});
            self.computePay();
        }else{
            self.setData({
                check: false,
                totalPay:0,
                displayTotalPay:"0.00",
                'couponInfo.couponId':0,
                'couponInfo.money':0,
                'cardInfo.money':0,
            });
        }
    },
    /**
     * 计算支付
     */
    computePay:function(){
        var self = this,currentValue = this.data.inputValue;
        //cardInfo.use 是否用卡等级
        if(self.data.cardInfo.use) {
            var money = this.data.inputValue * (1- self.data.cardInfo.zhe * 0.1);
            self.setData({
                'cardInfo.money': money.toFixed(2)
            });
            currentValue -= money;
            if (currentValue <= 0) {
                self.setData({
                    totalPay: 0,
                    displayTotalPay: "0.00"
                });
                return;
            }
        }


        //couponInfo.use 是否用券
        if(self.data.couponInfo.use && self.data.couponInfo.couponId){//用户使用了券
            currentValue -= self.data.couponInfo.money;
            if(currentValue <= 0){
                self.setData({
                    totalPay:0,
                    displayTotalPay:"0.00"
                });
                    return;
            }
        }

        //intragelInfo.use是否用积分,用户使用了积分
        if(self.data.intragelInfo.use && self.data.intragelInfo.using){
            currentValue -= self.data.intragelInfo.money;
            if(currentValue <= 0){
                self.setData({
                    totalPay:0,
                    displayTotalPay:"0.00"
                });
                return;
            }
        }


        //如果支持余额
        if(self.data.moneyInfo.use && self.data.moneyInfo.using){
            currentValue -= self.data.moneyInfo.money;
            if(currentValue <= 0){
                self.setData({
                    totalPay:0,
                    displayTotalPay:"0.00"
                });
                return;
            }
        }
        self.setData({
            totalPay: currentValue,
            displayTotalPay: appInstance.formatMoney(currentValue)
        });
    }

});
