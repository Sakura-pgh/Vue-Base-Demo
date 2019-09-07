/*
 * 校验
 */

// 防抖函数
export const debounce = (func, wait = 1000) => {
    let timeout;
    return function(event) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.call(this, event);
        }, wait);
    };
};

/**
 * 判断是否为空,为空返回true
 * @param {Object} target
 */
export const isEmpty = target => {
    var dataType = typeof target; // typeof返回的是字符串，有六种可能："number"、"string"、"boolean"、"object"、"function"、"undefined" ;
    switch (dataType) {
        case 'number': // 数字
            return false;
        case 'string': // 字符串
            if (target === '') {
                // 为空
                return true;
            } else {
                return false;
            }
        case 'boolean': // 布尔值
            return target;
        case 'object': // 对象
            if (!target && typeof target !== 'undefined' && target !== 0) {
                // 为null
                return true;
            } else {
                for (var key in target) {
                    // 非空对象
                    return false;
                }
                return true;
            }
        case 'function': // 函数
            return false;
        case 'undefined': // undefined
            return true;
        default:
            return true;
    };
};

// 手机号校验
export const isValidPhone = value => /^1\d{10}$/.test(value);

// 校验邮箱
export const checkEmail = new RegExp(
    '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
);

// 校验身份证
export const checkIdentityCard = code => {
    var city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江 ',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北 ',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏 ',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外 '
    };
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], // 加权因子
        parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验位

    if (code.length === 15) {
        code = code.substring(0, 6) + '19' + code.substring(6, 15);
        var ocode = code.split('');
        var osum = 0;
        for (var i = 0; i < 17; i++) {
            osum += ocode[i] * factor[i];
        }
        code = code + parity[osum % 11].toString();
    }
    if (
        !code ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
            code
        )
    ) {
        // 身份证号格式错误
        return false;
    } else if (!city[code.substr(0, 2)]) {
        // 地址编码错误
        return false;
    } else {
        // 18位身份证需要验证最后一位校验位
        if (code.length === 18) {
            code = code.split('');
            var sum = 0;
            for (let i = 0; i < 17; i++) {
                sum += code[i] * factor[i];
            }
            if (parity[sum % 11] !== code[17]) {
                // 校验位错误
                return false;
            }
        }
    }
    return true;
};
