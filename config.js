/**
 * 小程序文件
 */

var host = 'https://www.icloudws.com';
var version = 'v1';
var debug = false;

var config = {
    host,
    version,
    debug,
    //发送SMS
    sendSmsUrl:`${host}/${version}/verifycodes/verify-code`,

    //应用信息
    appInfoUrl: `${host}/${version}/mini/appInfo`,

    //登录地址，用于建立会话
    loginUrl: `${host}/${version}/mini/userLogin`,

    //门店列表
    storeListUrl: `${host}/${version}/mini/mendian/storeList`,

    //用户和门店信息
    userDianInfoUrl: `${host}/${version}/mini/mendian/userDianInfo`,

    //用户中心数据
    userCenterInfo: `${host}/${version}/mini/mendian/userCenterInfo`,

    //获取卡设置信息
    cardSettingUrl: `${host}/${version}/mini/mendian/cardSettingInfo`,

    //开卡
    cardOpenUrl: `${host}/${version}/mini/mendian/openCard`,

    //我的卡巻
    myCouponUrl: `${host}/${version}/mini/mendian/myCoupon`,

    //商家巻
    couponUrl: `${host}/${version}/mini/mendian/coupons`,

	couponListUrl: `${host}/${version}/mini/mendian/couponList`,

	couponToMeUrl: `${host}/${version}/mini/mendian/couponToMe`,

    //领取一张卷
    getCouponUrl: `${host}/${version}/mini/mendian/getCoupon`,

    //卡数据
    cardInfoUrl: `${host}/${version}/mini/mendian/cardInfo`,

    //充值
    cardRechargeUrl: `${host}/${version}/mini/mendian/cardRecharge`,

    //充值记录
    rechargeListUrl:`${host}/${version}/mini/mendian/rechargeList`,

    //首页信息
    homeInfoUrl:`${host}/${version}/mini/mendian/homeInfo`,

    //卡
    cardShowUrl: `${host}/${version}/mini/mendian/cardShow`,

    //scanCode
    scanCodeUrl: `${host}/${version}/mini/mendian/scanCode`,

    //支付获取用户信息
    getPayInfoUrl: `${host}/${version}/mini/mendian/payInfo`,

    //处理支付
    postPayUrl: `${host}/${version}/mini/mendian/payHandler`,

    //去支付
    goPayUrl: `${host}/${version}/mini/mendian/goPay`,

    //订单列表
    orderListUrl:`${host}/${version}/mini/mendian/orders`,

	//设置用户生日
	setMemberBirthdayUrl: `${host}/${version}/mini/mendian/setMemberBirthday`,
    

};
module.exports = config;
