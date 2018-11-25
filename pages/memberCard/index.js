var config = require('../../config');
var appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
    data: {
        userInfo: {},
        logo_img: "",
        card: null,
        has_card: false,
        qrcode:"",
        card_no:""
    },
    onShow:function(){
        var self = this;
        appInstance.sendRequest({
            url: config.cardShowUrl,
            success:function(res){
                config.debug && console.log(res);
                if(res.data.success){
                    self.setData({
                        logo_img: res.data.appInfo.appLogo,
                        cardInfo:res.data.cardInfo,
                        qrcode:'http://yunhippo.icloudws.com/'+res.data.cardInfo.qrcode
                    })
                }

            }
        });
    }
})