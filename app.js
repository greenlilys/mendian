
var config = require('./config');
var ywsapp = require('./vendor/sintall-wechat-app-clent-sdk/index');
App({
    globalData:{
        tabBarPagePathArr:[
            "/pages/home/index",
            "/pages/order/index",
            "/pages/card/index",
            "/pages/my/index"
        ],
        //地理信息
        locationInfo: {
            latitude: '',
            longitude: '',
            address: ''
        },
        extConfig: null,
        appInfo: null,//应用的信息
		copyRight: ''//版权声明
    },
    /**
     * 生命周期函数--监听小程序初始化
     * 当小程序初始化完成时，会触发 onauLnch（全局只触发一次）
     */
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        ywsapp.setLoginUrl(config.loginUrl);
    },
    /**
     * 生命周期函数--监听小程序显示
     *
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow:function(){

    },
    /**
     * 生命周期函数--监听小程序隐藏
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide:function(){

    },
    /**
     * 错误监听函数
     *
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError:function(msg){
        console.log(msg);
    },
    /**
     * 后退
     */
    turnBack:function(){
        wx.navigateBack();
    },
    /**
     * 设置页面标题
     *
     * @param title
     */
    setPageTitle: function(title) {
        wx.setNavigationBarTitle({
            title: title
        });
    },
    /**
     * 系统信息
     *
     */
    getSystemInfo: function(){
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.systemInfo = res;
            }
        });
    },
    /**
     * 显示消信
     *
     * @param param
     */
    showToast: function(param) {
        wx.showToast({
            title: param.title,
            icon: param.icon,
            image: param.image,
            duration: param.duration || 1500,
            success: function(res) {
                typeof param.success == 'function' && param.success(res);
            },
            fail: function(res) {
                typeof param.fail == 'function' && param.fail(res);
            },
            complete: function(res) {
                typeof param.complete == 'function' && param.complete(res);
            }
        })
    },
    /**
     * 隐藏消信
     */
    hideToast: function() {
        wx.hideToast()
    },
    /**
     * 显示
     *
     * @param param
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowmodalobject
     */
    showModal: function(param){
        wx.showModal({
            title:param.title || '提示',
            content: param.content,
            showCancel: param.showCancel || false,
            cancelText: param.cancelText || '取消',
            cancelColor: param.cancelColor || '#000000',
            confirmText: param.confirmText || '确定',
            confirmColor: param.confirmColor || '#3CC51F',
            success: function(res){
                if(res.confirm){
                    typeof param.confirm == 'function' && param.confirm(res)
                }else{
                    typeof param.cancel == 'function' && param.cancel(res);
                }
            },
            fail: function(res) {
                typeof param.fail == 'function' && param.fail(res);
            },
            complete: function(res) {
                typeof param.complete == 'function' && param.complete(res);
            }
        })
    },
    /**
     * 微信支付
     * @param params
     * https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-pay.html#wxrequestpaymentobject
     */
    wxPay: function(params){
        var self = this;
        wx.requestPayment({
            'timeStamp': params.timeStamp,
            'nonceStr': params.nonceStr,
            'package': params.package,
            'signType': 'MD5',
            'paySign': params.paySign,
            success: function(res){
                self.wxPaySuccess(params)
                typeof params.success == 'function' && params.success()
            },
            fail:function(res){
                if(res.errMsg === 'requestPayment:fail cancel'){
                    typeof params.fail === 'function' && params.fail()
                    return
                }
                if(res.errMsg === 'requestPayment:fail'){
                    res.errMsg = '支付失败';
                }
                self.showModal({
                    content: res.errMsg
                })
                self.wxPayFail(params, res.errMsg);
                typeof params.fail === 'function' && params.fail();
            },
            complete:function(res){
                typeof params.complete == 'function' && params.complete(res);
            }
        })
    },
    /**
     * 微信支付功
     *
     * @param params
     */
    wxPaySuccess: function(params){
        let orderId = params.orderId,
            goodType = params.goodType;


    },
    /**
     *
     * 发送请求
     *
     * @param params
     * @param url
     * https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html#wxrequestobject
     */
    sendRequest(params){
        let self = this,
            data = params.data || {},
            header = params.header


        if(params.method){
            if (params.method.toLowerCase() == 'post') {
                data = this.modifyPostParam(data);
                header = header || {
                        'content-type': 'application/x-www-form-urlencoded;',
                    }
            }
            params.method = params.method.toUpperCase()
        }
        ywsapp.request(params);
    },
    /**
     * 跳转页面
     *
     * @param url
     * @param isRedirect
     */
    turnToPage: function(url, isRedirect) {
        var tabBarPagePathArr = this.getTabPagePathArr()
        // tabBar中的页面改用switchTab跳转
        if (tabBarPagePathArr.indexOf(url) != -1) {
            this.switchToTab(url,isRedirect)
            return
        }
        if (!isRedirect) {
            wx.navigateTo({
                url: url
            })
        } else {
            wx.redirectTo({
                url: url
            })
        }
    },
    switchToTab: function(url,isRedirect){
        if(!isRedirect){
            wx.switchTab({
                url: url
            });
        }else{
            wx.switchTab({
                url: url,
                success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onShow();
                }
            });
        }

    },
    turnBack: function(options){
        wx.navigateBack({
            delta: options ? (options.delta || 1) : 1
        });

    },
    getTabPagePathArr: function(){
        return this.globalData.tabBarPagePathArr
    },
    /**
     * 设置剪板数据
     *
     * @param options
     */
    setClipboardData: function(options) {
        wx.setClipboardData({
            data: options.data || '',
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 获取剪板数据
     *
     * @param options
     */
    getClipboardData: function(options) {
        wx.getClipboardData({
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 扫码
     *
     * @param options
     */
    scanCode: function(options) {
        options = options || {};
        wx.scanCode({
            onlyFromCamera: options.onlyFromCamera || false,
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 当前应用页面
     *
     * @returns {*}
     */
    getAppCurrentPage: function () {
        var pages = getCurrentPages();
        return pages[pages.length - 1];
    },
    setExtConfig:function (){
        var self = this;

        if(wx.getExtConfig){
            wx.getExtConfig({
                success: function (res) {
                    console.log(res);
                    self.globalData.extConfig = res.extConfig;
                }
            })
        }else{
            throw new Error('不支持');
        }
    },
    /**
     * 拨打电话
     */
    makePhoneCall: function(number, callback){
        if(number.currentTarget){
            var dataset = number.currentTarget.dataset;

            number = dataset.number;
        }
        wx.makePhoneCall({
            phoneNumber: number,
            success: callback
        })
    },
    /**
     * 获取地理位置
     *
     * @param options
     */
    getLocation: function(options){
        wx.getLocation({
            type: 'wgs84',
            success: options.success,
            fail: options.fail
        })
    },
    /**
     * 修改post参数
     *
     * @param obj
     */
    modifyPostParam: function(obj){
        let query = '',i,name,value,fullSubName, subName, subValue, innerObj

        for(name in obj){
            value = obj[name];

            if(value instanceof Array){
                for(i = 0; i < value.length; ++i){
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += this.modifyPostParam(innerObj) + '&';
                }
            }
            else if(value instanceof Object){
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += this.modifyPostParam(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null){
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    },
    shareAppMessage: function(options) {
        var self = this;
        return {
            title: options.title || this.getAppTitle() || "云微商智慧小店",
            desc: options.desc || this.getAppDescription() || '最好的应用小店',
            path: options.path,
            success: function () {

            }
        }
    },
    showShareMenu: function(options){
        options = options || {};
        wx.showShareMenu({
            withShareTicket: options.withShareTicket || false,
            success: options.success,
            fail: options.fail,
            complete: options.complete
        });
    },
    /**
     * 图片preview
     *
     * @param options
     */
    previewImage: function(options){
        wx.previewImage({
            current: options.current || '',
            urls: options.urls || [options.current]
        })
    },
    formatMoney: function($value){
        return parseFloat($value || 0).toFixed(2);
    },
	setApplicationCopyright: function (copyRight){
		if (true){
			wx.setStorage({
				key: 'copyRight',
				data: copyRight
			})
		}else{
			wx.setStorage({
				key: 'copyRight',
				data: '©云微商提供技术支持'
			})
		}
		
	},

});