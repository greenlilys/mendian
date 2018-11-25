var config = require('../../config');
var appInstance = getApp();

Page({

    data: {
        second: 60,
        selected: false,
        selected1: true,
        yanzheng: "yanzheng",
        hidden: "hidden",
        none: "none",
        istrue: true,
        yanzheng1: "yanzheng1",
        btn: "btn",
        nullHouse: true,
        getphone:false,
        differ: true,
        getphonenum:"",
        logo_img:"",
        card: null,
        message:'请输入正确的手机号！',
        showMessage: false,
        user_mobile:'',//用户输入手机号
        active_time:10,
    },
    onLoad: function (options) {
     
    },
    /**
     * 发送短信
     * @param e
     */
    sendSmsCode: function(e){
        var self = this;
        if(this.data.user_mobile != ''){
            self.setData({
                selected: true,
                selected1: false,
            });
            countdown(self);
            var mobile = this.data.user_mobile;
            appInstance.sendRequest({
                url:config.sendSmsUrl,
                method:'POST',
                data: {
                    mobile:mobile
                },
                success: function(res){
                    if(res.data.success== true){
                        wx.setStorage({
                            key: 'send_mobile_code_success_data',
                            data: {
                                user_send_mobile:mobile,
                                start_time:(new Date()).getTime(),
                                code:res.data.code
                            }
                        })
                    }
                   
                    appInstance.showModal({
                        content:res.message
                    });
                }
            })
        }
    },
    onShow:function(){
        var self = this;
        /**
         * 获取卡的设置信息
         */
        appInstance.sendRequest({
            url: config.cardSettingUrl,
            success: function (res) {
                config.debug && console.log(res);
                if (res.data.success == true) {
                    self.setData({
                        card: res.data.card,
						logo_img: res.data.appInfo.appLogo
                    })
                }
            },
            fail: function (res) {
                console.log('获取商家会员卡信息 fail')
            }
        });
    },


    /**
     * 用户输入的手机号
     *
     * @param event
     */

	userNumberInput: function (event) {
		var that = this;
		if (!(/^1\d{10}$/.test(event.detail.value))) {
			that.setData({
				user_mobile: "",
				yanzheng1: "yanzheng1"
			})
		} else {
			that.setData({
				user_mobile: event.detail.value,
				yanzheng1: "yanzheng2",
				message: '请输入正确的验证码！'
			});
			
		}
	},


    /**
     * 输入code
      * @param event
     */

    userCodeInput: function (event) {
        var that = this,data;
            data = wx.getStorageSync('send_mobile_code_success_data');
        //发送的手机号，和当前输入的手机号是否一致
        if(this.data.user_mobile != data.user_send_mobile){
            this.setData({
                message:'获取验证码手机号和当前输入手机号不一致！'
            })
            return;
        }
        //输入时是否过
        if(!!((new Date()).getTime() - this.data.active_time * 60) - data.code.start_time){
                this.setData({
                    message:'获取验证码已过期！'
                })
                return;
        }
        if(event.detail.value != data.code){
            this.setData({
                message:'验证码不正确'
            })
            return;
        }
            console.log(16);
        this.setData({
            check: true
        })
    },
    opencardClick: function () {
         if(this.data.check){
              appInstance.sendRequest({
                   url:config.cardOpenUrl,
                   method:'POST',
                   data:{
                        mobile:this.data.user_mobile
                   },
                   success:function(res){
                        config.debug && console.log(res);
                        if(res.data.success == true){//获取会员卡成功
                            appInstance.turnToPage('/pages/my/index',true);
                        }else{
                            appInstance.showModal({
                                showCancel: false,
								content:'系统错误'
                            });
                        }
                   }
              })
         }else{
            this.showMessage();
         }
    },

    /**
     * 显示消息
     *
     * @param message
     */
	showMessage: function (message) {
		var self = this;
		this.setData({
			showMessage: true,
			message: message || this.data.message
		});
		setTimeout(function () {
			self.setData({
				showMessage: false
			})
		}, 1000);
	},
});
function countdown(self) {

	var second = self.data.second;
	if (second == 0) {
		// console.log("Time Out...");
		self.setData({
			selected: false,
			selected1: true,
			second: 60,
		});
		return;
	}
	var time = setTimeout(function () {
		self.setData({
			second: second - 1
		});
		countdown(self);
	}
		, 1000)
};
function warning(that) {
	that.setData({
		nullHouse: false, //弹窗显示
	});
	setTimeout(function () {
		that.setData({
			nullHouse: true
		})
	}, 1000)
};
function cardwarning(that) {
	that.setData({
		differ: false, //弹窗显示
	});
	setTimeout(function () {
		that.setData({
			differ: true
		})
	}, 1000)
};


