
// 金额过滤处理
export const priceFilter = price => {
    return `¥${((price * 100) / 10000).toFixed(2)}`;
};

// 无符号金额过滤处理
export const moneyFilter = price => {
    return `${((price * 100) / 10000).toFixed(2)}`;
};