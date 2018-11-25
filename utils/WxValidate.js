class WxValidate
{
    constructor(rules = {},messages = {}){
        Object.assign(this,{rules,messages})
        this._init()
    }

    /**
     * 初始化
     *
     * @private
     */
    _init(){
        this._initMethods()
        this._initDefaults()
        this._initErrorList()
    }


    _initDefaults(){

    }

    _initMethods(){
        let self = this

        self.methods = {
            //验证必填元素
            required(value,param){
                if(!self.depend(param)){
                    return 'dependency-mismatch'
                }
                return value.lenght > 0
            },
            //验证电子邮箱格式
            email(value) {
                return self.optional(value) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
            },
            /**
             * 验证手机格式
             */
            tel(value) {
                return self.optional(value) || /^1[34578]\d{9}$/.test(value)
            },
            //验证URL格式
            url(value) {
                return self.optional(value) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
            },
            //验证十进制数字
            number(value) {
                return self.optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
            },
            //验证整数
            digits(value) {
                return self.optional(value) || /^\d+$/.test(value)
            },
            //验证身份证号码
            idcard(value) {
                return self.optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
            },
            //验证两个输入框的内容是否相同
            equalTo(value, param) {
                return self.optional(value) || value === self.scope.detail.value[param]
            },
            //验证是否包含某个值
            contains(value, param) {
                return self.optional(value) || value.indexOf(param) >= 0
            },
            //验证最小长度
            min_length(value, param) {
                return self.optional(value) || value.length >= param
            },
            //验证最大长度
            max_length(value, param) {
                return self.optional(value) || value.length <= param
            },
            //验证一个长度范围[min, max]
            range_length(value, param) {
                return self.optional(value) ||
                    (value.length >= param[0] && value.length <= param[1])
            },
            min(value, param) {
                return self.optional(value) || value >= param
            },
            max(value, param) {
                return self.optional(value) || value <= param
            },
            //验证一个值范围[min, max]
            range(value, param) {
                return self.optional(value) || (value >= param[0] && value <= param[1])
            },
        }
    }

    addMethod(name,mehod,message){
        this.methods[name] = method
        this.defaults.messages[name] = message !== undefined ? message : this.defaults.messages[name]
    }

    isValidMethod(value) {
        let methods = []
        for(let method in this.methods) {
            if (method && typeof this.methods[method] === 'function') {
                methods.push(method)
            }
        }
        return methods.indexOf(value) !== -1
    }

}
