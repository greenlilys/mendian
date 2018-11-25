var config = require('../../config');
var appInstance = getApp();

Page({

    /**
       * 页面的初始数据
       */
    data: {
          billList:[]

    },


    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {
        var self = this;
        appInstance.sendRequest({
            url: config.rechargeListUrl,
            success: function(res){
                if(res.data.success){
					config.debug && console.log(res);
                    self.setData({
                        billList:res.data.list
                    });
                }
            }
        })
    }
})