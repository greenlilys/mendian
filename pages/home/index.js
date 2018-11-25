
var config = require('../../config');
var appInstance = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        windowHeight: 0,
        windowWidth: 0,
		productList:[],//产品列表
		productLists:[],//全部产品
        list:[],//门店列表
		lists:[],//所有门店列表
        imgUrls:[],//轮播,
        displayLing: false,//是否有会员卡,商家是否开通这个功能
        hasCoupon: false,//商家是否有卷,
        card_info:"查看会员权益",
		
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
		wx.getSystemInfo({
            success: function (res) {
				
                self.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                });

            }
        });
        /*//设置标题
        appInstance.setPageTitle(appInstance.globalData.appInfo.appTitle || "智慧门店");
        config.debug && console.log(appInstance.globalData.appInfo);
        //设置轮播
        self.setData({
            imgUrls: appInstance.globalData.appInfo.appCoursels
        });*/

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var self = this;
        //门店列表信息
        //todo 优化
        appInstance.sendRequest({
            url:config.homeInfoUrl,
            success: function(res){
                if(res.data.success){
					
					var productLists = res.data.productList;
					var productList = productLists.slice(0,3);					
                    var list = [];
					for(var i = 0; i < res.data.list.length;i++ ){
                        var mendian_item = res.data.list[i];
                        var item = {                            
							isShow:'showBox',
                            array:[]
                        };
                        item.id = i;
                        item.logo_image = mendian_item.logo_image;
                        item.name = mendian_item.name;
                        item.address_detail = mendian_item.address_detail;
                        item.phone = mendian_item.phone;
                        item.address_location = mendian_item.address_location;
                        item.array = mendian_item.images;
                        list[i] = item;
                    };
					//console.log(res.data);//商家是否有优惠卷
					self.setData({
						lists:list,
                        list:list.slice(0,1),
						productLists: productLists,
						productList: productList,
                        imgUrls: res.data.appInfo.appCoursels,
                        displayLing: res.data.displayLing || false,
                        hasCoupon: res.data.hasCoupon.length || false,
                    });
                    appInstance.setPageTitle(res.data.appInfo.appTitle || "智慧门店");
                }
            },
            fail:function(res){
                // console.log(56);
            }
        });
		//appInstance.setApplicationCopyright();
		
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        let pageRouter = this.page_router,
            pathPath = '/pages/' + pageRouter + '/' + pageRouter;
        let desc = e.target ? e.target.dataset.desc :
        appInstance.globalData.appInfo.appShareMesage || appInstance.globalData.appInfo.appTitle;

        return appInstance.shareAppMessage({
            path: pathPath,
            desc: desc
        });
    },
	turnToPayorder:function(){
		appInstance.turnToPage('/pages/payOrder/index');
	},
    toggle:function(event){
        var that = this;
        var items = that.data.list;		
		if (items[event.currentTarget.id].isShow == 'showBox' ){
			items[event.currentTarget.id].isShow ='showBoxs';			        
            that.setData({
                list: items
            });
			console.log(that.data.list);
		} else if (items[event.currentTarget.id].isShow == 'showBoxs'){			
			items[event.currentTarget.id].isShow = 'showBox'
            that.setData({
                list: items
            });
        };
    },
	proPreviewImg:function(event){
		var that = this;
		var current = event.target.dataset.src;
		var productLists = that.data.productLists;
		var array = [];
		for (var i = 0; i < productLists.length; i++ ){
			array[i] = productLists[i].image
		};
		appInstance.previewImage({
			current: current,
			urls: array,
		});
	},
    previewImg:function(event){
        var that = this;
        var current = event.target.dataset.src;
        var array = that.data.list[event.target.id].array;
        appInstance.previewImage({
            current: current,
            urls: array,
        });
    },
	morePro: function(){
		var that = this;
		var productLists = that.data.productLists;
		if (that.data.productLists.length > 3 && that.data.productList.length <4){
			that.setData({
				productList: productLists
			})
		}else{
			that.setData({
				productList: productLists.slice(0,3)
			})
		}
		
	},
	moreShop:function(){
		var that = this;
		var lists = that.data.lists;
		if (that.data.lists.length > 1 && that.data.list.length < 2){
			that.setData({
				list: lists
			})
		}else{
			that.setData({
				list: lists.slice(0,1)
			})
		}
	},
    calling: function (event) {
		console.log(event);
        var that = this;
        var items = that.data.list;
        var phone = items[event.currentTarget.id].phone;
        wx.makePhoneCall({
            phoneNumber:phone,
            success: function () {
                console.log("成功拨打")
            }
        });
    },
    getLocation: function (event) {
        var that = this;
        var items = that.data.list;
        var address_location = items[event.currentTarget.id].address_location;

        var split_address = address_location.split(',');
        var latitude = Number(split_address[0]);
        var longitude = Number(split_address[1]);
        var address = items[event.currentTarget.id].address_detail;
        var name = items[event.currentTarget.id].name;
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            name: name,
            address: address
        })
    },
	scanCode:function () {
		wx.scanCode({
			onlyFromCamera: true,
			success: (res) => {
                if(res.scanType == "WX_CODE" || res.scanType == "QR_CODE"){
                    appInstance.sendRequest({
                        url: config.scanCodeUrl,
                        data:{ path:res.path},
                        method:'post',
                        success:function(response){
                            if(response.data.success){
                                appInstance.turnToPage("/"+res.path);
                            }else{
                                appInstance.showToast({
                                    title: response.data.message,
                                    image:'/images/errors.png'
                                })
                            }

                        },
                        fail:function(){

                        }
                    })
                }else{
                    appInstance.showToast({
                        title: "无效微信码！",
                        image:'/images/errors.png'
                    })
                }


			},
			fail: (res) => {
				console.log(res);
			}
		})
	},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

});