const VERSION = 'v1';
const DEBUG = true;
const API_HOST = 'https://apihippo.icloudws.com';

var API_MAPS =  new Map([
    ['login_url','mini/userLogin'],
]);


var getApi = function getApi(key){
    if(API_MAPS.has(key)){
        return API_HOST+'/'+VERSION+'/'+API_MAPS.get(key);
    }
    throw Error('API_MAPS 没有定义：' + key )
}

module.exports = {
    getApi: getApi,
    DEBUG: DEBUG,
    API_HOST: API_HOST
};